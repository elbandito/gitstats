gitstats
========

github organization stats

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gitstats.svg)](https://npmjs.org/package/gitstats-org)
[![Downloads/week](https://img.shields.io/npm/dw/gitstats.svg)](https://npmjs.org/package/gitstats-org)
[![License](https://img.shields.io/npm/l/gitstats.svg)](https://github.com/elbandito/gitstats/blob/master/package.json)

```
USAGE
  $ gitstats COMMAND

ARGUMENTS
  ORG                                          (required) github organization name

OPTIONS
  -a, --auth                                   authenticate with github
  -l, --limit=limit                            number of repos to display (default is 10)
  --columns=columns                            only show provided columns (comma-separated)
  --csv                                        output is csv format

  --no-header                                  hide table header from output

  --no-truncate                                do not truncate output to fit screen

  --sort=sort                                  property to sort by (prepend '-' for descending)


DESCRIPTION
  Displays PR stats for github organization

EXAMPLES
  $ gitstats github-org --limit=20 --auth
  $ gitstats github-org --columns='repo,stars'     --sort='-stars --csv'
  $ gitstats github-org --columns='repo,forks'     --sort='-forks'
  $ gitstats github-org --columns='repo,prs'       --sort='-prs'
  $ gitstats github-org --columns='repo,prs/forks' --sort='-prs/forks'
```
To Run Locally

`$ ./bin/run oclif COMMAND`
