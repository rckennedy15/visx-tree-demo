import { Group } from '@visx/group';
import { NodeProps } from './Node';
import { colors } from './Colors';

export default function ParentNode({ node, onNodeClick }: NodeProps) {
	const width = 40;
	const height = 20;
	const centerX = -width / 2;
	const centerY = -height / 2;

	return (
		<Group top={node.x} left={node.y}>
			<rect
				height={height}
				width={width}
				y={centerY}
				x={centerX}
				fill={colors.background}
				stroke={colors.blue}
				strokeWidth={1}
				onClick={() => onNodeClick(node)}
			/>
			<text
				dy='.33em'
				fontSize={9}
				fontFamily='Arial'
				textAnchor='middle'
				style={{ pointerEvents: 'none' }}
				fill={colors.white}
			>
				{node.data.name}
			</text>
		</Group>
	);
}
