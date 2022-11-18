import { Group } from '@visx/group';
import { HierarchyNode, NodeProps } from './Node';
import { colors } from './Colors';

export default function RootNode({ node, onNodeClick }: NodeProps) {
	return (
		<Group top={node.x} left={node.y}>
			<circle
				r={12}
				fill="url('#main')"
				onClick={() => onNodeClick(node)}
			/>
			<text
				dy='.33em'
				fontSize={9}
				fontFamily='Arial'
				textAnchor='middle'
				style={{ pointerEvents: 'none' }}
				fill={colors.plum}
			>
				{node.data.name}
			</text>
		</Group>
	);
}
