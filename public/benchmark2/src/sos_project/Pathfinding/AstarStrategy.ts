import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */
export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        const graph = this.mesh.graph;
        // open and closed list
        const open = [];
        const closed = [];
        // maps node to its parent
        const parents = new Map();
        // node ids of start and destination
        const start = graph.snap(from);
        const destination = graph.snap(to);
        let curr = graph.snap(from);
        let edges = graph.getEdges(curr);
        // loop through all edges to starting node
        while(edges != null) {
            const edgePos = this.mesh.graph.positions[edges.y];
            const distTo = Math.abs(edgePos.y - to.y) + Math.abs(edgePos.x - to.x);
            open.push({y:edges.y, g:edges.weight, h: distTo});
            parents.set(edges.y, curr);
            edges = edges.next;
        }
        closed.push(curr);
        while(true) {
            // calculate lowest g + h and store information for best scorer
            let bestScore = Number.MAX_SAFE_INTEGER;
            let bestY = -1;
            let bestIndex = -1;
            let bestG = Number.MAX_SAFE_INTEGER;
            for(let i = 0; i < open.length; i++) {
                const node = open[i];
                if (node.g + node.h < bestScore) {
                    bestScore = node.g + node.h;
                    bestIndex = i;
                    bestY = node.y;
                    bestG = node.g;
                }
            }
            open.splice(bestIndex, 1);
            closed.push(bestY)
            curr = bestY;
            edges = graph.getEdges(curr);
            // will end navigation if destination not found and open list is empty
            if (open.length == 0 && edges == null) {
                return new NavigationPath(new Stack());
            }
            while(edges != null) {
                // will end navigation if destination found, then trace path through parent map
                if (edges.y == destination) {
                    let currParent = curr;
                    const fullPath = new Stack<Vec2>(this.mesh.graph.numVertices);
                    fullPath.push(this.mesh.graph.positions[edges.y]);
                    while(currParent != start) {
                        fullPath.push(this.mesh.graph.positions[currParent]);
                        currParent = parents.get(currParent);
                    }
                    return new NavigationPath(fullPath);
                }
                // skip closed nodes
                if (closed.includes(edges.y)) {
                    edges = edges.next;
                    continue;
                }
                // determine index if node is already in open list
                let found = -1;
                for(let i = 0; i < open.length; i++) {
                    if (open[i].y == edges.y) {
                        found = i;
                        break;
                    }
                }
                // if node not in open list, add info to open list, otherwise edit info
                if(found == -1) {
                    const edgePos = this.mesh.graph.positions[edges.y];
                    const distTo = Math.abs(edgePos.y - to.y) + Math.abs(edgePos.x - to.x);
                    open.push({y:edges.y, g:bestG + edges.weight, h: distTo});
                    parents.set(edges.y, curr);
                } else {
                    open[found].g = Math.min(open[found].g, bestG + edges.weight);
                }
                edges = edges.next;
            }
        }
    }
    
}