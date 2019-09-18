import {color} from '@heroku-cli/color'
import {Command, flags} from '@oclif/command'
import * as Octokit from '@octokit/rest'
import cli from 'cli-ux'

class Gitstats extends Command {
  static description = 'displays PR stats for github organization'
  static examples = [
    '$ gitstats github-org --auth',
    '$ gitstats github-org --columns=\'repo,stars\' --sort=\'forks\'',
  ]

  static args = [{
    name: 'org',
    description: 'github organization',
    required: true
  }]

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    limit: flags.integer({
      char: 'l',
      description: 'number of repos to display (max of 50 is allowed)',
      default: 10,

    }),
    auth: flags.boolean({
      description: 'authenticate with github',
      default: false
    }),
    ...cli.table.flags({except: ['extended', 'filter']})
  }

  static tableHeaders = {
    repo: {header: 'Repo'},
    stars: {header: 'Stars'},
    forks: {header: 'Forks'},
    pullRequests: {header: 'PRs'},
    pullRequestsToForks: {header: 'PRs/forks'}
  }
  private _flags: any

  async run() {
    const {args, flags} = this.parse(Gitstats)
    this._flags = flags

    if (flags.limit && flags.limit > 50) {
      cli.error('--limit cannot be greater than 50')
    }

    const octokit = await this.createOctokit(flags.auth)
    const orgStats = await this.getOrgStats(octokit, args.org, flags.limit)

    if (orgStats.length === 0) {
      return this.warn(`No data available for ${color.blue(args.org)}.  If this is a private org, try using --auth`)
    }

    cli.table(orgStats, Gitstats.tableHeaders, {
      printLine: this.log,
      ...this._flags,
    })
  }

  private async getOrgStats(octokit: Octokit, org: string, limit: number): Promise<Array<any>> {
    const stats: any = []
    try {
      const repos = await octokit.repos.listForOrg({
        org,
        per_page: limit
      })

      await Promise.all(repos.data.map(async (repo: Octokit.ReposListForOrgResponseItem) => {
        const pulls = await octokit.pulls.list({
          owner: repo.owner.login,
          repo: repo.name,
          state: 'open'
        })

        let pullRequestsToForks = repo.forks_count === 0 ? 0 : (pulls.data.length / repo.forks_count)
        pullRequestsToForks = Math.ceil(pullRequestsToForks * 1000) / 1000

        stats.push({
          repo: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          pullRequests: pulls.data.length,
          pullRequestsToForks
        })
      }))
    } catch (error) {
      if (error.status === 404) {
        cli.error(`github organization ${org} was not found`)
      }
      cli.error(`${error.message}`)
    }

    return stats
  }

  private async createOctokit(auth: boolean): Promise<Octokit> {
    let octokit: Octokit

    if (auth) {
      const username = await cli.prompt('github username')
      const password = await cli.prompt('github password', {type: 'hide'})

      // TODO: Handle SAML token
      octokit = new Octokit({
        auth: {
          username,
          password,
          async on2fa() {
            return cli.prompt('What is your two-factor token?', {type: 'mask'})
          }
        }
      })
    } else {
      octokit = new Octokit()
    }

    return octokit
  }
}

export = Gitstats
