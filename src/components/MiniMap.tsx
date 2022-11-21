import { type } from '@testing-library/user-event/dist/type';
import { Group } from '@visx/group';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { colors } from './Colors';
import { TreeNode } from './Node';
import TreeRender from './TreeRender';

export type MiniMapProps = {
	data: TreeNode;
	width: number;
	height: number;
	zoom: ProvidedZoom<SVGSVGElement>;
	margin?: { top: number; right: number; bottom: number; left: number };
};

export default function MiniMap({
	data,
	width,
	height,
	zoom,
	margin = { top: 10, right: 80, bottom: 10, left: 80 },
}: MiniMapProps) {
	const getZoomStringInvertWithMargins = (
		zoom: ProvidedZoom<SVGSVGElement>
	) => {
		const str = zoom.toStringInvert();
		// str format: matrix(1, 0, 0, 1, 0, 0)
		// we want to add the margins to the last two numbers
		const parts = str.split(',');
		parts[4] = ` ${parseInt(parts[4]) + margin.left}`;
		parts[5] = ` ${parseInt(parts[5]) + margin.top})`;
		return parts.join(',');
	};
	return (
		<Group
			clipPath='url(#zoom-clip)'
			transform={`scale(0.25) translate(${width * 4 - width - 60}, ${
				height * 4 - height - 60
			})`}
		>
			<rect width={width} height={height} fill={colors.background2} />
			<TreeRender
				data={data}
				width={width}
				height={height}
				margin={margin}
			/>
			<rect
				width={width}
				height={height}
				fill='white'
				fillOpacity={0.2}
				stroke='white'
				strokeWidth={4}
				transform={getZoomStringInvertWithMargins(zoom)}
			/>
		</Group>
	);
}
