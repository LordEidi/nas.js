/*-----------------------------------------------------------------------------
 **
 ** - nas.js -
 **
 ** Copyright 2014-15 by
 ** SwordLord - the coding crew - http://www.swordlord.com
 ** and contributing authors
 **
 ** This program is free software; you can redistribute it and/or modify it
 ** under the terms of the GNU General Public License as published by the Free
 ** Software Foundation, either version 3 of the License, or (at your option)
 ** any later version.
 **
 ** This program is distributed in the hope that it will be useful, but WITHOUT
 ** ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 ** FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 ** more details.
 **
 ** You should have received a copy of the GNU General Public License along
 ** with this program. If not, see <http://www.gnu.org/licenses/>.
 **
 **-----------------------------------------------------------------------------
 **
 ** Original Authors:
 ** LordEidi@swordlord.com
 ** LordLightningBolt@swordlord.com
 **
 ** $Id:
 **
 -----------------------------------------------------------------------------*/
var config = require('./config').config;

var http = require('http');
var crossroads = require('crossroads');
crossroads.ignoreState = true;

var url = require('url');
var fs = require('fs');
var shell = require('shelljs');

function onMDStatus(req, res, disc)
{
    res.writeHead(200, {'Content-Type': 'text/plain'});

    console.log(disc);

//    var str = "The best things in life are free";
//    var patt = new RegExp("e");
//    var res = patt.test(str);

    //var file = '../logs/' + scantype.replace(new RegExp('[^a-zA-Z0-9.]+', 'g'), '') + '_current.log';

    if(disc == 'all')
    {
        shell.exec('helpers/mdadm_detail /dev/md0', {silent:true}, function (code, output) {

            var json = JSON.stringify({
                info: 'MD Status all',
                exitCode: code,
                programOutput: output
            });

            res.end(json);
        });

    }
    else
    {
        shell.exec('helpers/mdadm_detail /dev/' + disc, {silent:true}, function(code, output) {

            var json = JSON.stringify({
                info: 'MD Status ' + disc,
                exitCode: code,
                programOutput: output
            });

            res.end(json);
        });
    }
}

function onHDDStatus(req, res, disc)
{
    res.writeHead(200, {'Content-Type': 'text/plain'});

    console.log(disc);

    shell.exec('helpers/smartctl_h /dev/' + disc, function(code, output) {

        var json = JSON.stringify({
            info: 'Disc Status ' + disc,
            exitCode: code,
            programOutput: output
        });

        res.end(json);
    });
}


function onShutdown(req, res, path)
{
    console.log(path);

    res.writeHead(200, {'Content-Type': 'text/plain'});

    shell.exec('shutdown -kh now', {silent:true}, function(code, output) {

        var json = JSON.stringify({
            info: 'Shutdown',
            exitCode: code,
            programOutput: output
        });

        res.end(json);
    });
}

function onRaidStatus(req, res, path)
{
    console.log(path);

    res.writeHead(200, {'Content-Type': 'text/plain'});

    shell.exec('cat /proc/mdstat', {silent:true}, function(code, output) {

        var json = JSON.stringify({
            info: 'RAID Status',
            exitCode: code,
            programOutput: output
        });

        res.end(json);
    });
}

function onBypass(req, res, path)
{
    console.log('URL unknown' + path);

    res.writeHead(200, {'Content-Type': 'text/plain'});

    var json = JSON.stringify({
        info: path,
        exitCode: -1,
        programOutput: 'function unknown'
    });

    res.end(json);
}

function onGetStaticContent(req, res, url)
{
    //res.writeHead(200, {'Content-Type': 'text/plain'});

    var file = 'wwwroot/' + url.replace(new RegExp('[^a-zA-Z0-9./-]+', 'g'), '');
    //file = file.replace(new RegExp('\.\.', 'g'), '');

    console.log(file);

    if(fs.existsSync(file))
    {
        fs.readFile(file, function (err, data)
        {
            if (err) throw err;
            res.write(data);

            res.end('');
        });
    }
    else
    {
        res.write('file unknown');

        res.end('');
    }
}

// -----------------------------------------------------------------------------
crossroads.addRoute('/server/shutdown/', onShutdown);
crossroads.addRoute('/raid/status/', onRaidStatus);
crossroads.addRoute('/md/{disc}/status', onMDStatus);
crossroads.addRoute('/hdd/{disc}/status', onHDDStatus);

crossroads.addRoute('/s/{url*}', onGetStaticContent);

crossroads.bypassed.add(onBypass);

// -----------------------------------------------------------------------------
var server = http.createServer(function (req, res)
{
    var sUrl = url.parse(req.url).pathname;
    console.log(sUrl);
    crossroads.parse(sUrl, [req, res]);

});

process.on('uncaughtException', function(err)
{
    console.log('Caught exception: ' + err);
});

server.listen(config.port, config.ip);
console.log('Server running on %s:%s', config.ip, config.port);
