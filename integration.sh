rm -rf integration/dist
npm pack .

PACKAGE=`find . -name webpack-plugin-critical-*`

cd integration

npm install
npm install ../$PACKAGE
rm ../$PACKAGE

./node_modules/.bin/webpack
node check-gen-html.js

cd ../
