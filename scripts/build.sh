#!/bin/bash

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="${BASE_DIR}/css"
JS_DIR="${BASE_DIR}/js"
NODE_DIR="${BASE_DIR}/node_modules"

echo "Building Javascript"
NODE_ENV=production "${NODE_DIR}/.bin/browserify" "${JS_DIR}/calculator.jsx" -t [ babelify --presets [ es2015 react ] ] | "${NODE_DIR}/.bin/uglifyjs" -v - -o "${JS_DIR}/calculator-app.js"

# PNGOUT from http://advsys.net/ken/utils.htm or http://www.jonof.id.au/kenutils/
echo "Crushing PNGs"
find ${BASE_DIR} -type f -name "*.png" -print0 | xargs -0 pngout

# Sass from http://sass-lang.com/
echo "Building CSS"
sass --no-cache --force --unix-newlines --scss --style compressed "${CSS_DIR}/main.scss":"${CSS_DIR}/main.css" && rm "${CSS_DIR}/main.css.map"
sass --no-cache --force --unix-newlines --scss --style compressed "${CSS_DIR}/main-old.scss":"${CSS_DIR}/main-old.css" && rm "${CSS_DIR}/main-old.css.map"

# During development, just keep this running in a shell:
# sass --watch --no-cache --unix-newlines --scss main.scss:main.css

echo "Done"
