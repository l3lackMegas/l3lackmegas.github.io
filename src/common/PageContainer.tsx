import * as React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, MotionValue, stagger, useMotionValue, useSpring, useTransform, useViewportScroll } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { TextColor, IThemeState } from '../context';

import './PageContainer.scss';

type Props = {
    pathName: string,
    children: React.ReactNode
};
type State = {
    toggleNav: Boolean,
    mounted: Boolean,
    unieqKey: number,
    scrollY: number,
    isNavToggling: Boolean,
};
class PageContainer extends React.Component<Props, State, IThemeState> {
    context!: IThemeState;

    state: State = {
        toggleNav: true,
        mounted: false,
        unieqKey: 0,
        scrollY: 0,
        isNavToggling: false,
    };

    contentScroll = React.createRef<HTMLDivElement>();
    smoothElmScroll = React.createRef<HTMLDivElement>();
    pageElmContainer = React.createRef<HTMLDivElement>();

    containerVariant = {
        initial: {
            y: '120vh',
            scale: .5,
            borderRadius: 50,
            opacity: 0
        },
        // animate: {
        //     y: 0,
        //     scale: 1,
        //     transition: {
        //         duration: 1,
        //         ease: [1, .1, .35, 1],
        //     }
        // },
        exit: {
            y: '-100vh',
            scale: .1,
            // opacity: 0,
            borderRadius: 50,
            maxHeight: 0,
            transition: {
                duration: .75,
                ease: [1, .1, .35, 1],
            }
        }
    }

    componentDidMount(): void {
        this.context.setCrrFeature(this.props.pathName);
        this.setState({
            unieqKey: Date.now(),
        });
        window.scrollTo(0, 0);
        this.context.setParallaxPos(0);
        this.context.setCrrPageHeight(this.contentScroll.current?.clientHeight || 0);
        setTimeout(() => {
            this.context.setIsToggleNav(false); 
            window.addEventListener('scroll', this.onScrollHandler);
            this.context.setCrrPageHeight(this.contentScroll.current?.clientHeight || 0);
        }, 500);
    }

    componentWillUnmount(): void {
        window.removeEventListener('scroll', this.onScrollHandler);
    }

    onScrollHandler = (e: Event) => {
        // if(this.context.crrFeature === this.props.pathName) {
        //     let scrollling = this.smoothElmScroll.current,
        //         compos: any = scrollling ? window.getComputedStyle(scrollling) : {},
        //         matrix = new WebKitCSSMatrix(compos.transform),
        //         currentScroll = window.isMobile ? window.scrollY : matrix.m42 * -1;
        //     this.context.setParallaxPos(currentScroll);   
        // }

        this.context.setCrrPageHeight(this.contentScroll.current?.clientHeight || 0);
        this.context.setScrollTop(window.scrollY);
        if(this.context.crrFeature === this.props.pathName) {
            this.setState({
                scrollY: window.scrollY
            });
        }
    }

    toggleNavHandler() {
        if(this.state.isNavToggling) return;
        this.setState({
            isNavToggling: true
        });
        this.context.setIsToggleNav(!this.state.toggleNav);

        setTimeout(() => {
            this.setState({
                toggleNav: !this.state.toggleNav,
                isNavToggling: false
            });
        }, this.state.toggleNav ? 750 : 0);
    }

    render() {
        const { textColor, crrFeature, isToggleNav, setIsToggleNav }: IThemeState = this.context;
        const { pathName } = this.props;
        const { toggleNav, mounted, unieqKey, scrollY } = this.state;

        const namespace = (pathName.split('/')[1] || 'home') + unieqKey.toString();

        return (
            <>
                <motion.div
                    id="PageContainer"
                    ref={this.pageElmContainer}
                    className={'PageContainer ' + namespace + (window.isMobile ? ' mobile' : '') + (toggleNav ? ' toggled' : '')}
                    key={'PageContainer' + namespace}
                    variants={this.containerVariant}
                    initial='initial'
                    animate={{
                        y: isToggleNav ? 140 : 0,
                        scale: isToggleNav ? 0.95 : 1,
                        opacity: 1,
                        borderRadius: isToggleNav ? 50 : 0,
                        transition: {
                            duration: mounted ? 0.75 : 1,
                            ease: !window.onFirstMounted || mounted ? [0.5, 0.025, 0, 1] : [1, .1, .35, 1],
                        }
                    }}
                    exit='exit'
                    onAnimationComplete={() => {
                        this.setState({
                            mounted: true,
                            toggleNav: !mounted ? false : toggleNav
                        })
                    }}
                >
                    <AnimatePresence mode='sync' key="pageDimer">
                        { isToggleNav &&
                            <motion.div
                                className='dimPullMenu'
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    transition: {
                                        duration: .75,
                                        ease: [0.5, 0.025, 0, 1],
                                    }
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: .75,
                                        ease: [0.5, 0.025, 0, 1],
                                    }
                                }}
                                onClick={() => {
                                    this.toggleNavHandler();
                                }}
                            ></motion.div>
                        }
                    </AnimatePresence>
                    {/* <WrapPageScroll
                        crrPathName={pathName}
                        refSmooth={this.smoothElmScroll}
                    > */}
                        <motion.div className="sub content-overflow" ref={this.contentScroll}
                            style={{
                                y: toggleNav ? -scrollY : 0,
                            }}
                        >
                            {this.props.children}
                        </motion.div>
                    {/* </WrapPageScroll> */}
                </motion.div>
                { toggleNav &&
                    <div style={{
                        height: this.context.crrPageHeight,
                    }}></div>
                }
                
                <motion.div
                    className={'PageContainer toggled'}
                    key={'subPage' + namespace}
                    variants={this.containerVariant}
                    initial='initial'
                    animate={{
                        opacity: 1,
                        y: isToggleNav ? 140 : 0,
                        scale: isToggleNav ? 0.95 : 1,
                        transition: {
                            duration: mounted ? 0.75 : 1,
                            ease: !window.onFirstMounted || mounted ? [0.5, 0.025, 0, 1] : [1, .1, .35, 1],
                        }
                    }}
                    exit='exit'
                    style={{
                        top: 0,
                        height: 0,
                        minHeight: 'unset',
                        overflow: 'unset',
                    }}
                >
                    <motion.button className={'btnTopCenter' + (toggleNav ? ' active' : '')} style={{
                            color: textColor.value,
                            pointerEvents: 'all',
                            zIndex: 9999,
                        }}
                        initial={{
                            opacity: 0,
                            y: -100,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: .5,
                                duration: .5,
                                ease: [1, .1, .35, 1],
                            }
                        }}
                        onClick={() => {
                            // if(toggleNav !== isToggleNav) return;
                            this.toggleNavHandler();
                        }}
                    >
                        <motion.div className="sub" style={{ overflow: 'hidden' }}>
                            <motion.div className="bgPullMenu" style={{
                                backgroundColor: textColor.value
                            }}></motion.div>
                            
                            
                            { toggleNav && <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    transition: {
                                        duration: .25,
                                    }
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: .25,
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronUp}/>
                            </motion.div>}
                            
                            { !toggleNav && <motion.div
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: 1,
                                    transition: {
                                        duration: .25,
                                    }
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: {
                                        duration: .25,
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronDown}/>
                            </motion.div>}
                        </motion.div>
                    </motion.button>
                </motion.div>
            </>
        );
    }
}

PageContainer.contextType = TextColor;

export default PageContainer;

const WrapPageScroll = ({ children, crrPathName, refSmooth }: {
    children: React.ReactNode
    crrPathName: string
    refSmooth: React.RefObject<HTMLDivElement>
}) => {

    const appContext: IThemeState = React.useContext(TextColor);

    const scrollY = useMotionValue(appContext.scrollTop);
    // const { scrollY } = useViewportScroll()
    

    // console.log(appContext.crrPageHeight)
    // const transform = useTransform(scrollY, [0, appContext.crrPageHeight], [0, -appContext.crrPageHeight])
    // const physics = {
    //     damping: 15,
    //     mass: 0.27,
    //     stiffness: 100,
    // } // easing of smooth scroll
    // const spring = useSpring(transform, physics); // apply easing to the negative scroll value

    React.useLayoutEffect(() => {
        if(appContext.crrFeature !== crrPathName) {
            return
        }
        scrollY.set(appContext.scrollTop);
    }, [appContext.crrFeature, appContext.scrollTop, crrPathName, scrollY]);
    console.log(scrollY)
    return (
        <motion.div
            ref={refSmooth}
            // className="scroll-container"
            style={{
                y: -scrollY.get(),
            }}
        >
            {children}
        </motion.div>
    ); 
}