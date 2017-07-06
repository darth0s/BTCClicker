@echo off
echo *****  Starting bitlucky ******
echo ################################
casperjs bitlucky_withdrawal.js

echo ***** Starting bituniverse ******
echo ################################
casperjs bituniverse_withdrawal.js

echo *****  Starting Plansads  ******
echo ################################
casperjs btcforclicks_withdrawal.js

pause