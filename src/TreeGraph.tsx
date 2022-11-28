import { LinearGradient } from '@visx/gradient';
import { Zoom } from '@visx/zoom';
import { colors } from './components/Colors';
import { TreeNode } from './components/Node';
import { RectClipPath } from '@visx/clip-path';
import { localPoint } from '@visx/event';
import TreeRender from './components/TreeRender';
import Controls from './components/Controls';
import MiniMap from './components/MiniMap';
import { animated } from '@react-spring/web';

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
	const initialTransform = {
		scaleX: 1,
		scaleY: 1,
		translateX: 80,
		translateY: 10,
		skewX: 0,
		skewY: 0,
	};

	return width < 100 ? null : (
		<animated.div>
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
							<TreeRender
								data={data}
								width={width}
								height={height}
								zoom={zoom}
								margin={margin}
							/>
							<MiniMap
								data={data}
								width={width}
								height={height}
								zoom={zoom}
								margin={margin}
							/>
						</svg>
						<Controls zoom={zoom} />
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
		</animated.div>
	);
}
