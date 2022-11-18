import React from 'react';
import ReactDOM from 'react-dom/client';
import TreeGraph from './TreeGraph';
import ParentSize from '@visx/responsive/lib/components/ParentSizeModern';

import './index.css';
import data from './data.json';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<ParentSize>
			{({ width, height }) => (
				<TreeGraph data={data} width={width} height={height} />
			)}
		</ParentSize>
	</React.StrictMode>
);
