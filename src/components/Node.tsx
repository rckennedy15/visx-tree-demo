import { Group } from '@visx/group';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';

import { colors } from './Colors';
import ParentNode from './ParentNode';
import RootNode from './RootNode';

export interface TreeNode {
	name: string;
	children?: TreeNode[] | undefined;
	isExpanded?: boolean | undefined;
	_children?: TreeNode[] | undefined;
}

export type HierarchyNode = HierarchyPointNode<TreeNode>;

export type NodeProps = {
	node: HierarchyNode;
	onNodeClick: (node: HierarchyNode) => void;
};

export default function Node({ node, onNodeClick }: NodeProps) {
	const width = 40;
	const height = 20;
	const centerX = -width / 2;
	const centerY = -height / 2;
	const isRoot = node.depth === 0;
	const isParent = !!node.data.children;

	if (isRoot) return <RootNode node={node} onNodeClick={onNodeClick} />;
	if (isParent) return <ParentNode node={node} onNodeClick={onNodeClick} />;

	return (
		// eventually this will be fully customizable
		// and the rect will just be an overlay for handling the click event

		<Group top={node.x} left={node.y}>
			<rect
				height={height}
				width={width}
				y={centerY}
				x={centerX}
				fill={colors.background}
				stroke={colors.green}
				strokeWidth={1}
				strokeDasharray='2,2'
				strokeOpacity={0.6}
				rx={10}
				// shouldn't need onClick here since it's a leaf node
				// onClick={() => onNodeClick(node)}
			/>
			<text
				dy='.33em'
				fontSize={9}
				fontFamily='Arial'
				textAnchor='middle'
				fill={colors.green}
				style={{ pointerEvents: 'none' }}
			>
				{node.data.name}
			</text>
		</Group>
	);
}
