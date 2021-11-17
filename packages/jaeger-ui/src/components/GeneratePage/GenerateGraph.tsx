// Copyright (c) 2018 The Jaeger Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as React from 'react';
import { Digraph, LayoutManager } from '@jaegertracing/plexus';
import cacheAs from '@jaegertracing/plexus/lib/cacheAs';

import { getNodeRenderer, renderNodeVectorBorder, MODE_SERVICE } from '../TracePage/TraceGraph/OpNode';
import { TEv, TSumSpan } from '../TracePage/TraceGraph/types';
import { TDenseSpanMembers } from '../../model/trace-dag/types';
import TDagPlexusVertex from '../../model/trace-dag/types/TDagPlexusVertex';
import { TNil } from '../../types';

type Props = {
  ev?: TEv | TNil;
};
type State = {
  mode: string;
};

const { classNameIsSmall, scaleOpacity, scaleStrokeOpacity } = Digraph.propsFactories;

export function setOnEdgePath(e: any) {
  return e.followsFrom ? { strokeDasharray: 4 } : {};
}

export default class GenerateGraph extends React.PureComponent<Props, State> {
  state: State;

  cache: any;

  layoutManager: LayoutManager;

  static defaultProps = {
    ev: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      mode: MODE_SERVICE,
    };
    this.layoutManager = new LayoutManager({ useDotEdges: true, splines: 'polyline' });
  }

  componentWillUnmount() {
    this.layoutManager.stopAndRelease();
  }

  render() {
    const { ev } = this.props;
    const { mode } = this.state;
    if (!ev) {
      return <h1 className="u-mt-vast u-tx-muted ub-tx-center">No trace found</h1>;
    }

    return (
      <Digraph<TDagPlexusVertex<TSumSpan & TDenseSpanMembers>>
        zoom
        layoutManager={this.layoutManager}
        measurableNodesKey="nodes"
        layers={[
          {
            key: 'edges',
            edges: true,
            layerType: 'svg',
            defs: [{ localId: 'arrow' }],
            markerEndId: 'arrow',
            setOnContainer: [scaleOpacity, scaleStrokeOpacity],
            setOnEdge: setOnEdgePath,
          },
          {
            key: 'nodes-borders',
            layerType: 'svg',
            setOnContainer: scaleStrokeOpacity,
            renderNode: renderNodeVectorBorder,
          },
          {
            key: 'nodes',
            layerType: 'html',
            measurable: true,
            renderNode: cacheAs(`trace-graph/nodes/render/${mode}`, getNodeRenderer(mode)),
          },
        ]}
        setOnGraph={classNameIsSmall}
        edges={ev.edges}
        vertices={ev.vertices}
      />
    );
  }
}
