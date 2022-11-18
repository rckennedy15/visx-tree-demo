import React, { useMemo } from 'react';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { LinkHorizontal } from '@visx/shape';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';
import { colors } from './components/Colors';
import Node, { HierarchyNode, TreeNode } from './components/Node';

export type TreeGraphProps = {
	data: TreeNode;
	width: number;
	height: number;
	margin?: { top: number; right: number; bottom: number; left: number };
};

export default function TreeGraph({
	data,
	width,
	height,
	margin = { top: 10, right: 80, bottom: 10, left: 80 },
}: TreeGraphProps) {
	const hierarchyData = useMemo(() => hierarchy(data), [data]);
	const yMax = height - margin.top - margin.bottom;
	const xMax = width - margin.left - margin.right;

	return width < 100 ? null : (
		<svg width={width} height={height}>
			<LinearGradient id='main' from={colors.peach} to={colors.pink} />
			<rect
				width={width}
				height={height}
				rx={14}
				fill={colors.background}
			/>
			<Tree<TreeNode> root={hierarchyData} size={[yMax, xMax]}>
				{(tree) => (
					<Group top={margin.top} left={margin.left}>
						{tree.links().map((link, i) => (
							<LinkHorizontal
								key={`link-${i}`}
								data={link}
								stroke={colors.lightPurple}
								strokeWidth='1'
								fill='none'
							/>
						))}
						{tree.descendants().map((node, i) => (
							<Node
								key={`node-${i}`}
								node={node}
								onNodeClick={() => {
									alert(
										`clicked: ${JSON.stringify(
											node.data.name
										)}`
									);
								}}
							/>
						))}
					</Group>
				)}
			</Tree>
		</svg>
	);
}
