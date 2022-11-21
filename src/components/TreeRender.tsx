import { Group } from '@visx/group';
import { Tree, hierarchy } from '@visx/hierarchy';
import { LinkHorizontal } from '@visx/shape';
import { ProvidedZoom } from '@visx/zoom/lib/types';
import { useMemo } from 'react';
import Node, { TreeNode } from './Node';
import { colors } from './Colors';

export type TreeRenderProps = {
	data: TreeNode;
	width: number;
	height: number;
	zoom?: ProvidedZoom<SVGSVGElement>;
	margin?: { top: number; right: number; bottom: number; left: number };
};

export default function TreeRender({
	data,
	width,
	height,
	zoom,
	margin = { top: 10, right: 80, bottom: 10, left: 80 },
}: TreeRenderProps) {
	const hierarchyData = useMemo(() => hierarchy(data), [data]);
	const yMax = height - margin.top - margin.bottom;
	const xMax = width - margin.left - margin.right;
	return (
		<Tree<TreeNode> root={hierarchyData} size={[yMax, xMax]}>
			{(tree) => (
				<Group
					top={margin.top}
					left={margin.left}
					transform={!!zoom ? zoom.toString() : ''}
				>
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
									`clicked: ${JSON.stringify(node.data.name)}`
								);
							}}
						/>
					))}
				</Group>
			)}
		</Tree>
	);
}
