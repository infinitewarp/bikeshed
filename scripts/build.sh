#!/bin/bash

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="${BASE_DIR}/css"

# PNGOUT from http://advsys.net/ken/utils.htm or http://www.jonof.id.au/kenutils/
find ${BASE_DIR} -type f -name "*.png" -print0 | xargs -0 pngout

# Sass from http://sass-lang.com/
sass --no-cache --force --unix-newlines --scss --style compressed "${CSS_DIR}/main.scss":"${CSS_DIR}/main.css"

# During development, just keep this running in a shell:
# sass --watch --no-cache --unix-newlines --scss main.scss:main.css