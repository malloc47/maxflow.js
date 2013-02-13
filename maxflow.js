var maxflow = function() {
    "use strict";

    /* 
       Implementation of
       http://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm
    */
    function edmonds_karp(C,source,sink) {
        var n = C.length;
        var F = zeros(n);
        var diff = function(e){
            return C[e[0]][e[1]] - F[e[0]][e[1]];
        };
        while(true) {
            var path = bfs(C, F, source, sink);
            if(!path) {break;}
            var flow = Math.min.apply(Math,path.map(diff));
            for(var i = 0; i < path.length; i++) {
                F[path[i][0]][path[i][1]] += flow;
                F[path[i][1]][path[i][0]] -= flow;
            }
        }
        var total = 0;
        for(var j = 0; j < F.length; j++) {
            total += F[source][j];
        }
        return total;
    }

    function bfs(C,F,source,sink) {
        var queue = [source];
        var paths = {};
        paths[source] = [];
        while(queue.length > 0) {
            var u = queue.shift();
            for (var v = 0; v < C.length; v++) {
                if(C[u][v] - F[u][v] > 0 && !(v in paths)) {
                    paths[v] = paths[u].concat([[u,v]]);
                    if(v == sink) return paths[v];
                    queue.push(v);
                }
            }
        }
        return null;
    }

    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, thisArg) {
            var T, A, k;
            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callback !== "function") {
                throw new TypeError(callback + " is not a function");
            }
            if (thisArg) {
                T = thisArg;
            }
            A = new Array(len);
            k = 0;
            while(k < len) {
                var kValue, mappedValue;
                if (k in O) {
                    kValue = O[ k ];
                    mappedValue = callback.call(T, kValue, k, O);
                    A[ k ] = mappedValue;
                }
                k++;
            }
            return A;
        };
    }

    function zeros(n) {
        var matrix = [];
        for(var i=0; i<n; i++) {
            matrix[i] = [];
            for(var j=0; j<n; j++) {
                matrix[i][j] = 0;
            }
        }
        return matrix;
    }

    function unit_test() {
        var C = [[0, 3, 3, 0, 0, 0],
                 [0, 0, 2, 3, 0, 0],
                 [0, 0, 0, 0, 2, 0],
                 [0, 0, 0, 0, 4, 2],
                 [0, 0, 0, 0, 0, 3],
                 [0, 0, 0, 0, 0, 0]];
        var source = 0;
        var sink = 5;
        return (edmonds_karp(C,source,sink)==5);
    }

    return {
        name: 'maxflow',
        edmonds_karp: edmonds_karp,
        unit_test: unit_test
    };
}();
