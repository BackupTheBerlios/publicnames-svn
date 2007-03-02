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

var SAT = {
	languages: {'ASCII':[
	    /\s*[?!.](?:\s+|$)/, // point, split sentences
	    /\s*[:;](?:\s+|$)/, // split head from sequence
	    /\s*,(?:\s+|$)/, // split the sentence articulations
	    /(?:(?:^|\s+)[({\[]+\s*)|(?:\s*[})\]]+(?:$|\s+))/, // parentheses
	    /\s+[-]+\s+/, // disgression
	    /["]/, // citation
	    /(?:^|\s+)(?:(?:([A-Z]+[\S]*)(?:$|\s)?)+)/, // private names
	    /\s+/, // white spaces
	    /['\\\/*+\-#]/ // common hyphens
	]}
};

SAT.articulators = function (articulators) {
    return new RegExp(
        '(?:^|\\s+)((?:' + articulators.join (')|(?:') + '))(?:$|\\s+)'
        );
}

SAT.articulate = function (text, articulators, depth, chunks, chunk) {
    var i, L, articulated, name, field;
	var bottom = articulators.length;
    while (true) {
        var texts = text.split(articulators[depth]); depth++;
        if (texts.length > 1) {
		    articulated = new Array();
	        for (i = 0, L=texts.length; i < L; i++) if (texts[i].length > 0)
	        	articulated.push(texts[i]);
	        L=articulated.length;
	        if (L > 1) break; else if (L == 1) text = articulated[0];
        } else if (texts.length == 1 && texts[0].length > 0) text = texts[0];
        if (depth == bottom) return text;
    }
    if (depth < bottom) 
    	if (chunk!=null) {
	        for (i = 0; i < L; i++) {
	            text = articulated[i];
	            if (text.length > chunk)
	                this.articulate(text, articulators, depth, chunks, chunk);
		    	else {
		    		field = new Object();
			    	name = netArticulate(
			    		this.articulate(text, articulators, depth), field
			    		);
			    	if (name!=null) chunks.push([name, text, field]);
		    	} 
	    	} return null;
	    } else {
		    var names = new Array(); for (i = 0; i < L; i++) names.push(
	    		this.articulate(articulated[i], articulators, depth)
	    		);
		    return names;
	    }
    else return articulated;
}