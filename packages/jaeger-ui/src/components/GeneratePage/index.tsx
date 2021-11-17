// Copyright (c) 2017 Uber Technologies, Inc.
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

import calculateTraceDagEV from '../TracePage/TraceGraph/calculateTraceDagEV';
import TraceGraph from './GenerateGraph';
import transformTraceData from '../../model/transform-trace-data';

import './index.css';

function GeneratePage() {
  const [trace, setTrace] = React.useState<any>();

  React.useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data.cmd === 'setTrace') {
        setTrace(JSON.parse(event.data.data));
      }
    };

    window.addEventListener('message', listener, false);

    return () => window.removeEventListener('message', listener, false);
  }, []);

  if (!trace) {
    return null;
  }

  const ev = calculateTraceDagEV(transformTraceData(trace.data[0]) as any);

  return <TraceGraph ev={ev} />;
}

export default GeneratePage;
