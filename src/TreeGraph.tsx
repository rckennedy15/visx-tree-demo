import React, { useMemo } from 'react';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { LinkHorizontal } from '@visx/shape';
import { Tree, hierarchy } from '@visx/hierarchy';
import { HierarchyPointNode } from '@visx/hierarchy/lib/types';

const colors = {
	background: '#272b4d',
	background2: '#1b1e34',
	peach: '#fd9b93',
	pink: '#fe6e9e',
	blue: '#03c0dc',
	green: '#26deb0',
	plum: '#71248e',
	lightPurple: '#374469',
	white: '#ffffff',
};

interface TreeNode {
	name: string;
	children?: this[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

function Node({ node }: { node: HierarchyNode }) {
	const width = 40;
	const height = 20;
	const centerX = -width / 2;
	const centerY = -height / 2;
	const isRoot = node.depth === 0;
	const isParent = !!node.children;

	if (isRoot) return <RootNode node={node} />;
	if (isParent) return <ParentNode node={node} />;

	return (
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
				onClick={() => {
					alert(`clicked: ${JSON.stringify(node.data.name)}`);
				}}
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

function RootNode({ node }: { node: HierarchyNode }) {
	return (
		<Group top={node.x} left={node.y}>
			<circle r={12} fill="url('#main')" />
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

function ParentNode({ node }: { node: HierarchyNode }) {
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
				onClick={() => {
					alert(`clicked: ${JSON.stringify(node.data.name)}`);
				}}
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
	const hierarchyData = useMemo(() => hierarchy(data), []);
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
							<Node key={`node-${i}`} node={node} />
						))}
					</Group>
				)}
			</Tree>
		</svg>
	);
}
