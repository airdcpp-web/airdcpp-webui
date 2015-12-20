rmdir /S /Q dist

mkdir dist
xcopy index.html dist
xcopy favicon.ico dist

SET NODE_ENV=production
npm run webpack --progress

pause

