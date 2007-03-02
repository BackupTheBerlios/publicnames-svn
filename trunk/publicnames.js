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
/**
 * Push a netunicode of the given string s in sb.
 */
function netUnicode (s, sb) {
	sb.push(s.length); sb.push(":"); sb.push(s); sb.push(",");
}
/**
 * Encode an array of strings (or anything that [].join('') can join) into
 * netunicodes, return a string.
 */
function netUnicodes (array) {
	var s, sb = new Array();
	for (var i=0; i < array.length; i++) {
		s=array[i]; sb.push(s.length); sb.push(":"); sb.push(s); sb.push(",");
	};
	return sb.join('');
};
/**
 * Push in a list the unidecoded strings found in the buffer, eventually
 * stripping empty strings (0:,) if strip is true, returns the extended
 * array or the one created if the list given was null and that at least
 * one netunicoded string was found at the buffer's start.
 */
function netUnidecodes (buffer, list, strip) {
	var size = buffer.length;
	var prev = 0;
	var pos, L, next;
	while (prev < size) {
		pos = buffer.indexOf(":", prev);
		if (pos < 1) prev = size; else {
			L = parseInt(buffer.substring(prev, pos))
			if (isNaN(L)) prev = size; else {
				next = pos + L + 1;
				if (next >= size) prev = size; else {
					if (buffer.charAt(next) != ",") prev = size; else {
						if (list==null) list = new Array();
						if (strip | next-pos>1)
							list.push(buffer.substring(pos+1, next));
						prev = next + 1;
					}
				}
			}
		}
	}
	return list;
};
/**
 * Push in sb an HTML representation of the nested netunicodes found in
 * the buffer, as nested span elements with articulated Public Names set
 * as title attribute and inarticulated unidecoded strings as CDATA.
 */
function netHTML (buffer, sb) {
	var articulated = netUnidecodes (buffer, new Array(), false);
	if (articulated.length == 0) {sb.push('<span>'); sb.push(buffer);}
	else {
		sb.push('<span title="'); sb.push(buffer); sb.push('">');
		for (var i=0, L=articulated.length; i < L; i++)
			netHTML(articulated[i], sb);
	}
	sb.push('</span>');
	return sb
}
/**
 * Articulate a JavaScript value as valid Public Names. 
 */
function netArticulate (item, field) {
	if (typeof item == 'object') {
		var list = new Array(), L=item.length, n;
		if (L == null) for (var k in item) {
			n = netArticulate([k, item[k]], field);
			if (n!=null) list.push(n);
		} else for (var i=0; i < L; i++) {
			n = netArticulate(item[i], field);
			if (n!=null) list.push(n);
		}
		L = list.length;
		if (L > 1) {list.sort(); return netUnicodes(list);}
		else if (L == 1) return list[0];
		else return null;
	} else item = item.toString(); 
	if (field[item] == null) {field[item] = true; return item;}
	else return null;
} // this is for articulation of JSON only ...
/**
 * Returns null or a valid Public Names if one could be articulated from
 * the given string buffer and semantic field.
 */
function publicNames (buffer, field) {
    var names = netUnidecodes(buffer, null, true);
    if (names == null) {
        if (field[buffer] != null) return null;
        field[buffer] = true; return buffer;
    } else {
        var valid = new Array ();
        for (var i=0, L=names.length; i < L; i++) {
            n = publicNames(names[i], field);
            if (n != null) valid.push(n);
        };
        if (valid.length > 1) {valid.sort(); return netUnicodes(valid);};
        if (valid.length > 0) return valid[0];
        return null;
	}
} // this is it for validation & articulation ;-)