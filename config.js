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

// Place all your configuration options here

var config =
{
    // server specific configuration
    // please use a proxy in front of najs when using it in a hostile
    // environment to support TLS. We suggest you use nginx as the TLS endpoint
    //
    // if you want to catch traffic on all interfaces, use 0.0.0.0 as an IP address
    port: 8888,
    ip: '127.0.0.1'

};

// Exporting.
module.exports = {
    config: config
};