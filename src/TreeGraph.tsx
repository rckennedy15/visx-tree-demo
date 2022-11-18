import React, { useMemo } from 'react';
import { LinearGradient } from '@visx/gradient';
import { Group } from '@visx/group';
import { LinkHorizontal } from '@visx/shape';
import { Tree, hierarchy } from '@visx/hierarchy';
import { Zoom } from '@visx/zoom';
import { colors } from './components/Colors';
import Node, { TreeNode } from './components/Node';
import { RectClipPath } from '@visx/clip-path';
import { localPoint } from '@visx/event';
import { ProvidedZoom } from '@visx/zoom/lib/types';

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

	const initialTransform = {
		scaleX: 1,
		scaleY: 1,
		translateX: 80,
		translateY: 10,
		skewX: 0,
		skewY: 0,
	};

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

	return width < 100 ? null : (
		<>
			<Zoom<SVGSVGElement>
				width={width}
				height={height}
				scaleXMin={1 / 2}
				scaleXMax={4}
				scaleYMin={1 / 2}
				scaleYMax={4}
				initialTransformMatrix={initialTransform}
			>
				{(zoom) => (
					<div className='relative'>
						<svg
							width={width}
							height={height}
							style={{
								cursor: zoom.isDragging ? 'grabbing' : 'grab',
								touchAction: 'none',
							}}
							ref={zoom.containerRef}
						>
							<RectClipPath
								id='zoom-clip'
								width={width}
								height={height}
							/>
							<LinearGradient
								id='main'
								from={colors.peach}
								to={colors.pink}
							/>
							<rect
								width={width}
								height={height}
								rx={14}
								fill={colors.background}
							/>
							<rect
								width={width}
								height={height}
								rx={14}
								fill='transparent'
								onTouchStart={zoom.dragStart}
								onTouchMove={zoom.dragMove}
								onTouchEnd={zoom.dragEnd}
								onMouseDown={zoom.dragStart}
								onMouseMove={zoom.dragMove}
								onMouseUp={zoom.dragEnd}
								onMouseLeave={() => {
									if (zoom.isDragging) zoom.dragEnd();
								}}
								onDoubleClick={(event) => {
									const point = localPoint(event) || {
										x: 0,
										y: 0,
									};
									zoom.scale({
										scaleX: 1.1,
										scaleY: 1.1,
										point,
									});
								}}
							/>
							<Tree<TreeNode>
								root={hierarchyData}
								size={[yMax, xMax]}
							>
								{(tree) => (
									<Group
										top={margin.top}
										left={margin.left}
										transform={zoom.toString()}
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

							<g
								clipPath='url(#zoom-clip)'
								transform={`
                    scale(0.25)
                    translate(${width * 4 - width - 60}, ${
									height * 4 - height - 60
								})
                  `}
							>
								<rect
									width={width}
									height={height}
									fill={colors.background2}
								/>
								<Tree<TreeNode>
									root={hierarchyData}
									size={[yMax, xMax]}
								>
									{(tree) => (
										<Group
											top={margin.top}
											left={margin.left}
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
											{tree
												.descendants()
												.map((node, i) => (
													<Node
														key={`node-${i}`}
														node={node}
														onNodeClick={() => {
															alert(
																`clicked: ${JSON.stringify(
																	node.data
																		.name
																)}`
															);
														}}
													/>
												))}
										</Group>
									)}
								</Tree>
								<rect
									width={width}
									height={height}
									fill='white'
									fillOpacity={0.2}
									stroke='white'
									strokeWidth={4}
									transform={getZoomStringInvertWithMargins(
										zoom
									)}
								/>
							</g>
						</svg>
						<div className='controls'>
							<button
								type='button'
								className='btn btn-zoom'
								onClick={() =>
									zoom.scale({ scaleX: 1.2, scaleY: 1.2 })
								}
							>
								+
							</button>
							<button
								type='button'
								className='btn btn-zoom btn-bottom'
								onClick={() =>
									zoom.scale({ scaleX: 0.8, scaleY: 0.8 })
								}
							>
								-
							</button>
							<button
								type='button'
								className='btn btn-lg'
								onClick={zoom.reset}
							>
								Reset
							</button>
						</div>
					</div>
				)}
			</Zoom>
			<style>{`
				.btn {
					margin: 0;
					text-align: center;
					border: none;
					background: #2f2f2f;
					color: #888;
					padding: 0 4px;
					border-top: 1px solid #0a0a0a;
				}
				.btn-lg {
					font-size: 12px;
					line-height: 1;
					padding: 4px;
				}
				.btn-zoom {
					width: 26px;
					font-size: 22px;
				}
				.btn-bottom {
					margin-bottom: 1rem;
				}
				.description {
					font-size: 12px;
					margin-right: 0.25rem;
				}
				.controls {
					position: absolute;
					top: 15px;
					right: 15px;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				}
				.mini-map {
					position: absolute;
					bottom: 25px;
					right: 15px;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				}
				.relative {
					position: relative;
				}
			`}</style>
		</>
	);
}
