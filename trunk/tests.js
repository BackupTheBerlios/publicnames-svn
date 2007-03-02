/* Copyright (C) 2007 Laurent A.V. Szyster

This library is free software; you can redistribute it and/or modify
it under the terms of version 2 of the GNU General Public License as
published by the Free Software Foundation.

	http://www.gnu.org/copyleft/gpl.html

This library is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

You should have received a copy of the GNU General Public License
along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA */

function testPublicNames(string, names) {
    if (string==publicNames(string, new Object())) {
        names.innerHTML = netHTML(
            string, new Array(), '<span', '</span>', netHTML
            ).join('');
        names.removeClassName("hidden");
    }
}

function testSAT(string, articulated) {
	var chunks = new Array(); 
	SAT.articulate(string, 0, chunks, 72);
	var sb = new Array(); 
	for (var i=0, L=chunks.length; i<L; i++) {
		sb.push('<div>'); 
		netHTML(chunks[i][0], sb, netHTML); 
		sb.push('</div>');
	}
	articulated.innerHTML = sb.join(''); 
	articulated.removeClassName("hidden");
}

function testQuery() {}