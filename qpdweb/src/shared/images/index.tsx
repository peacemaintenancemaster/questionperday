import MoonSvg from './icon/moon.svg?react';
import SunSvg from './icon/sun.svg?react';
import LogoSvg from './logo/logo.svg?react';
import ShareSvg from './icon/share.svg?react';
import HomeSvg from './icon/home.svg?react';
import ClockSvg from './icon/clock.svg?react';
import CheckSvg from './icon/check.svg?react';
import PersonSvg from './icon/person.svg?react';
import TalkSvg from './icon/talk.svg?react';
import MailSvg from './icon/mail.svg?react';
import WarnSvg from './icon/warn.svg?react';
import DownloadSvg from './icon/export.svg?react';
import ArrowLeftSvg from './icon/arrow-left.svg?react';
import ArrowRightSvg from './icon/arrow-right.svg?react';
import UserSvg from './icon/user.svg?react';

interface Props {
	width: string;
	height: string;
	color: string;
	stroke: string;
	size: string;
}

export const Image = {
	Logo: (props: Pick<Props, 'width' | 'height'>) => <Logo {...props} />,
};

export const Icon = {
	ArrowLeft: (props: Partial<Props>) => <ArrowLeft {...props} />,
	ArrowRight: (props: Partial<Props>) => <ArrowRight {...props} />,
	Moon: (props: Pick<Props, 'size' | 'color'>) => <Moon {...props} />,
	Sun: (props: Pick<Props, 'size' | 'color'>) => <Sun {...props} />,
	Share: (props: Pick<Props, 'size' | 'color'>) => <Share {...props} />,
	Home: (props: Pick<Props, 'size' | 'color'>) => <Home {...props} />,
	Clock: (props: Pick<Props, 'size'>) => <Clock {...props} />,
	Check: () => <Check />,
	Person: (props: Pick<Props, 'size' | 'color'>) => <Person {...props} />,
	Talk: (props: Pick<Props, 'size' | 'color'>) => <Talk {...props} />,
	Mail: (props: Pick<Props, 'size' | 'color'>) => <Mail {...props} />,
	Warn: (props: Pick<Props, 'size' | 'color'>) => <Warn {...props} />,
	Download: (props: Pick<Props, 'size' | 'color'>) => <Download {...props} />,
	User: (props: Pick<Props, 'size' | 'color'>) => <User {...props} />,
};

const ArrowLeft = (props: Partial<Props>) => {
	const { size, color = '#252525' } = props;

	return <ArrowLeftSvg width={size} height={size} stroke={color} />;
};

const ArrowRight = (props: Partial<Props>) => {
	const { size, color = '#252525' } = props;

	return <ArrowRightSvg width={size} height={size} stroke={color} />;
};

const Logo = (props: Pick<Props, 'width' | 'height'>) => {
	const { width, height } = props;

	return <LogoSvg width={width} height={height} />;
};

const Moon = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;

	return <MoonSvg width={size} height={size} fill={color} />;
};

const Sun = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;

	return <SunSvg width={size} height={size} style={{ color }} />;
};

const Share = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;

	return <ShareSvg width={size} height={size} fill={color} />;
};

const Home = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;

	return <HomeSvg width={size} height={size} fill={color} />;
};

const Clock = (props: Pick<Props, 'size'>) => {
	const { size } = props;

	return <ClockSvg width={size} height={size} />;
};

const Check = () => {
	return <CheckSvg />;
};

const Person = (props: Pick<Props, 'size' | 'color'>) => {
	const { color, size } = props;

	return <PersonSvg fill={color} height={size} width={size} />;
};

const Talk = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;

	return <TalkSvg width={size} height={size} fill={color} />;
};

const Mail = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;
	return <MailSvg width={size} height={size} fill={color} />;
};

const Warn = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;
	return <WarnSvg width={size} height={size} fill={color} />;
};

const Download = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;
	return <DownloadSvg width={size} height={size} fill={color} />;
};

const User = (props: Pick<Props, 'size' | 'color'>) => {
	const { size, color } = props;
	return <UserSvg width={size} height={size} fill={color} />;
};
