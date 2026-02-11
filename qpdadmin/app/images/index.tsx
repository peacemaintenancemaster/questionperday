import LogoSvg from './logo/logo.svg?react';
import HideSvg from './icon/hide.svg?react';
import ArrowLeftSvg from './icon/arrow-left.svg?react';
import ArrowRightSvg from './icon/arrow-right.svg?react';
import ClockSvg from './icon/clock.svg?react';
import CalendarSvg from './icon/calendar.svg?react';
import ListSvg from './icon/list.svg?react';
import TrashBinSvg from './icon/trashbin.svg?react';
import PlusSvg from './icon/plus.svg?react';
import CheckSvg from './icon/check.svg?react';
import DoubleArrowSvg from './icon/double-arrow.svg?react';
import PhotoSvg from './icon/photo.svg?react';
import { useTheme } from '@emotion/react';

interface IconProps {
	width: string;
	height: string;
	color: string;
	stroke: string;
	size: string;
}

export const Icon = {
	Logo: (props: Partial<IconProps>) => <Logo {...props} />,
	Hide: (props: Pick<IconProps, 'size'>) => <Hide {...props} />,
	ArrowLeft: (props: Partial<IconProps>) => <ArrowLeft {...props} />,
	ArrowRight: (props: Partial<IconProps>) => <ArrowRight {...props} />,
	Clock: (props: Partial<IconProps>) => <Clock {...props} />,
	Calendar: (props: Partial<IconProps>) => <Calendar {...props} />,
	List: (props: Partial<IconProps>) => <List {...props} />,
	Plus: (props: Partial<IconProps>) => <Plus {...props} />,
	TrashBin: (props: Partial<IconProps>) => <TrashBin {...props} />,
	DoubleArrow: (props: Partial<IconProps>) => <DoubleArrow {...props} />,
	Check: () => <CheckSvg />,
	Photo: (props: Partial<IconProps>) => <Photo {...props} />,
};

const Logo = (props: Partial<IconProps>) => {
	const { width, height } = props;
	return <LogoSvg width={width} height={height} />;
};

const Hide = (props: Pick<IconProps, 'size'>) => {
	const { size } = props;

	return <HideSvg width={size} height={size} />;
};

const ArrowLeft = (props: Partial<IconProps>) => {
	const { size, color = '#252525' } = props;

	return <ArrowLeftSvg width={size} height={size} stroke={color} />;
};

const ArrowRight = (props: Partial<IconProps>) => {
	const { size, color = '#252525' } = props;

	return <ArrowRightSvg width={size} height={size} stroke={color} />;
};

const Clock = (props: Partial<IconProps>) => {
	const theme = useTheme();
	const { size, color = theme.color.main } = props;

	return <ClockSvg width={size} height={size} fill={color} />;
};

const Calendar = (props: Partial<IconProps>) => {
	const theme = useTheme();

	const { size, color = theme.color.grayScale.gray80 } = props;

	return <CalendarSvg width={size} height={size} fill={color} />;
};

const List = (props: Partial<IconProps>) => {
	const theme = useTheme();

	const { size, color = theme.color.grayScale.gray80 } = props;

	return <ListSvg width={size} height={size} fill={color} />;
};

const Plus = (props: Partial<IconProps>) => {
	const theme = useTheme();
	const { size, color = theme.color.grayScale.gray90 } = props;

	return <PlusSvg fill={color} width={size} height={size} />;
};

const TrashBin = (props: Partial<IconProps>) => {
	const theme = useTheme();
	const { color = theme.color.red.secondary, size } = props;

	return <TrashBinSvg fill={color} width={size} height={size} />;
};

const DoubleArrow = (props: Partial<IconProps>) => {
	const theme = useTheme();
	const { color = theme.color.grayScale.gray90, size } = props;

	return <DoubleArrowSvg width={size} height={size} stroke={color} />;
};
const Check = () => {
	return <DoubleArrowSvg />;
};

const Photo = (props: Partial<IconProps>) => {
	const { width = '12', height = '12' } = props;
	return <PhotoSvg width={width} height={height} />;
};
