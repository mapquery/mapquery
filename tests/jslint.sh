#!/bin/bash 
cd `dirname $0`/..
export MAPQUERY_HOME=`pwd`

JSLINTBIN=$MAPQUERY_HOME/tests/jslint/jslint4java-1.3.3.jar

echo -e ""
echo -e "### JSLint ###"
JS_FILES=$( find $MAPQUERY_HOME/src -type f -name \*.js | grep -vE '\/bundles\/' | grep -v '\/lib\/' | grep -v '\/data\/')

echo -e "Running jslint for the following files:" 
for file in $JS_FILES; do 
    echo $file
done

FILES=$( echo ${JS_FILES} | tr '\n' ' ' )

java -jar ${JSLINTBIN} ${FILES}
EXIT_STATUS=$?
echo -e "exit status: " ${EXIT_STATUS}

exit ${EXIT_STATUS}