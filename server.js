/*-----------------------------------------------------------------------------
 **
 ** - nas.js -
 **
 ** Copyright 2014 by
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
var http = require('http');
var crossroads = require('crossroads');
crossroads.ignoreState = true;

var url = require('url');
var fs = require('fs');
var shell = require('shelljs');

function onDiscStatus(req, res, disc)
{
    res.writeHead(200, {'Content-Type': 'text/plain'});

    res.write('Disc - '+ disc);

//    var str = "The best things in life are free";
//    var patt = new RegExp("e");
//    var res = patt.test(str);

    //var file = '../logs/' + scantype.replace(new RegExp('[^a-zA-Z0-9.]+', 'g'), '') + '_current.log';

    if(disc == 'all')
    {
        res.write('all');

        shell.exec('mdadm --detail /dev/md0', function (code, output) {
            res.write('Exit code:' + code);
            res.write('Program output:' + output);
            res.end('');
        });

    }
    else
    {
        res.write('Only one');

        shell.exec('mdadm --detail /dev/md0',function(code, output) {
            res.write('Exit code:' + code);
            res.write('Program output:' + output);
            res.end('');
        });

        res.end('');
    }
}


function onShutdown(req, res, path)
{
    console.log(path);

    res.writeHead(200, {'Content-Type': 'text/plain'});

    res.write('Shutting down server');

    res.end('');
}

function onRaidStatus(req, res, path)
{
    console.log(path);

    res.writeHead(200, {'Content-Type': 'text/plain'});

    res.write('RAID Status');
    // cat /proc/mdstat

    shell.exec('cat /proc/mdstat',function(code, output) {
        res.write('Exit code:' + code);
        res.write('Program output:' + output);
        res.end('');
    });
}

function onBypass(req, res, path)
{
        console.log('URL unknown' + path);

        res.writeHead(200, {'Content-Type': 'text/plain'});

        res.write('function unknown');

        res.end('');
}

function onGetWWWContent(req, res, url)
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
crossroads.addRoute('/disc/{disc}/status', onDiscStatus);

crossroads.addRoute('/www/{url*}', onGetWWWContent);

crossroads.bypassed.add(onBypass);

// -----------------------------------------------------------------------------
var server = http.createServer(function (req, res)
{
    var sUrl = url.parse(req.url).pathname;
    console.log(sUrl);
    crossroads.parse(sUrl, [req, res]);

});

server.listen(8888, '127.0.0.1');
console.log('Server running on 127.0.0.1:8888');