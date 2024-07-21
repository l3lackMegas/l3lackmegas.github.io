import * as React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, MotionValue, stagger, useMotionValue, useSpring, useTransform, useViewportScroll } from 'framer-motion';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { AppMainContext, IThemeState } from '../context';

import './PageContainer.scss';
import { checkIsMobile, isSafari } from '../lib/utility';
import Credit from './Credit';

type Props = {
    pathName: string
    children: React.ReactNode
    headerOverlayColor?: string
    parallaxCallback?: (pallraxPos: number) => void
};
type State = {
    toggleNav: boolean,
    mounted: boolean,
    unieqKey: number,
    scrollY: number,
    currentScroll: number,
    pageHeight: number,
    isNavToggling: boolean,
    isToggleNavContext: boolean
};
class PageContainer extends React.Component<Props, State, IThemeState> {
    context!: IThemeState;

    state: State = {
        toggleNav: true,
        mounted: false,
        unieqKey: 0,
        scrollY: 0,
        currentScroll: 0,
        pageHeight: 0,
        isNavToggling: false,
        isToggleNavContext: false,
    };

    contentScroll = React.createRef<HTMLDivElement>();
    smoothElmScroll = React.createRef<HTMLDivElement>();
    pageElmContainer = React.createRef<HTMLDivElement>();

    containerVariant = {
        initial: {
            y: '130vh',
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
            // maxHeight: 0,
            transition: {
                duration: .75,
                ease: [1, .1, .35, 1],
            }
        }
    }

    isCanNotSmooth = false;
    navigatingTimeout: any;

    componentWillMount(): void {
        this.context.setIsNavigating(true);
    }

    componentDidMount(): void {
        this.isCanNotSmooth = checkIsMobile() || isSafari()
        this.context.setCrrFeature(this.props.pathName);
        this.setState({
            unieqKey: Date.now(),
        });
        this.context.setIsNavigating(true);
        window.scrollTo(0, 0);
        this.context.setParallaxPos(0);
        this.context.setCrrPageHeight(this.contentScroll.current?.clientHeight || 0);
        document.body.style.overflow = '';
        setTimeout(() => {
            this.context.setIsToggleNav(false); 
            window.addEventListener('scroll', this.onScrollHandler);
            this.context.setCrrPageHeight(this.contentScroll.current?.clientHeight || 0);
            this.setState({
                pageHeight: this.contentScroll.current?.clientHeight || 0,
            });
        }, 500);

        setTimeout(() => {
            window.translateWithToggleNav = false;
        }, 1000);

        this.navigatingTimeout = setTimeout(() => {
            this.context.setIsNavigating(false);
        }, 2500);

        if(!this.isCanNotSmooth) {
            window.addEventListener("scroll", this.onScrollHandler)

            let observer = new MutationObserver(this.onScrollHandler),
                scrollling: any = document.querySelector("#smoothScrolling")
            observer.observe(scrollling, {
                attributes: true,
                attributeFilter: ['style'],
            });
        }
    }

    componentWillUnmount(): void {
        clearTimeout(this.navigatingTimeout);
        window.scrollTo(0, 0);
        window.removeEventListener('scroll', this.onScrollHandler);
        this.context.setIsNavigating(true);
    }

    onScrollHandler: any = (e: Event) => {
        // if(this.context.crrFeature === this.props.pathName) {
        //     let scrollling = this.smoothElmScroll.current,
        //         compos: any = scrollling ? window.getComputedStyle(scrollling) : {},
        //         matrix = new WebKitCSSMatrix(compos.transform),
        //         currentScroll = window.isMobile ? window.scrollY : matrix.m42 * -1;
        //     this.context.setParallaxPos(currentScroll);   
        // }

        // this.context.setCrrPageHeight(this.contentScroll.current?.clientHeight || 0);
        // this.context.setScrollTop(window.scrollY);
        if(this.context.crrFeature === this.props.pathName) {
            let scrollling = document.querySelector("#smoothScrolling"),
                compos: any = scrollling ? window.getComputedStyle(scrollling) : {},
                matrix = new WebKitCSSMatrix(compos.transform),
                currentScroll = this.isCanNotSmooth ? window.scrollY : matrix.m42 * -1;
            this.setState({
                scrollY: window.scrollY,
                currentScroll: currentScroll,
                pageHeight: this.contentScroll.current?.clientHeight || 0,
            });

            // console.log(currentScroll)
            
            if(this.props.parallaxCallback) this.props.parallaxCallback(currentScroll);
        }
    }

    toggleNavHandler() {
        if(this.state.isNavToggling) return;
        this.setState({
            isNavToggling: true,
            isToggleNavContext: !this.state.toggleNav
        });
        this.context.setIsTogglingNav(true);
        this.context.setIsToggleNav(!this.state.toggleNav);

        setTimeout(() => {
            this.context.setIsTogglingNav(false);
            this.setState({
                toggleNav: !this.state.toggleNav,
                isNavToggling: false
            });
            window.translateWithToggleNav = !this.state.toggleNav;
            // console.log(window.translateWithToggleNav)
        }, this.state.toggleNav ? 500  : 0);
    }

    render() {
        const { textColor, crrFeature, isToggleNav, setIsToggleNav, isCanNotSmooth }: IThemeState = this.context;
        const { pathName } = this.props;
        const { isToggleNavContext, toggleNav, isNavToggling, mounted, unieqKey, scrollY, currentScroll } = this.state;

        const namespace = (pathName.split('/')[1] || 'home') + unieqKey.toString();

        let shouldFloat = crrFeature !== pathName;

        return (
            <>
                <motion.div
                    id="PageContainer"
                    ref={this.pageElmContainer}
                    className={'PageContainer ' + namespace + (this.isCanNotSmooth ? ' mobile' : '') + (shouldFloat || toggleNav ? ' toggled' : '')}
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
                            ease: window.onFirstMounted || mounted ? [0.5, 0.025, 0, 1] : [1, .1, .35, 1],
                            delay: window.onFirstMounted || mounted || isNavToggling || window.translateWithToggleNav ? .0 : .5
                        }
                    }}
                    onAnimationStart={() => {
                        // if(crrFeature != pathName) {
                            
                        // }
                    }}
                    exit='exit'
                    onAnimationComplete={() => {
                        window.onFirstMounted = false;
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
                        <motion.div
                            // className="scroll-container"
                            style={!shouldFloat && this.isCanNotSmooth && !this.context.isToggleNav && !isNavToggling ? {
                                position: 'relative',
                                width: '100%',
                            } : {
                                position: 'fixed',
                                y: -currentScroll,
                                width: '100%',
                            }}
                        >
                            <motion.div className="sub content-overflow" ref={this.contentScroll}
                                style={{
                                    // y: toggleNav ? -scrollY : 0,
                                }}
                            >
                                {this.props.children}
                                <Credit/>
                            </motion.div>
                        </motion.div>
                    {/* </WrapPageScroll> */}
                </motion.div>
                { (shouldFloat || this.context.isToggleNav || isNavToggling || !this.isCanNotSmooth) &&
                    <div style={{
                        height: this.state.pageHeight,
                    }}></div>
                }
                
                {this.props.headerOverlayColor && <motion.div className={`overlay-header ${this.isCanNotSmooth ? ' mobile' : ''}`}
                    initial={{
                        opacity: 0,
                        y: -70
                    }}
                    animate={{
                        y: !mounted || this.context.isToggleNav ? -70 : -5,
                        opacity: !mounted || this.context.isToggleNav ? 0 : 1,
                        transition: {
                            duration: !mounted || this.context.isToggleNav ? .5 : .75,
                            ease: [0.5, 0.025, 0, 1],
                            delay: !mounted || this.context.isToggleNav ? 0 : .5
                        }
                    }}
                    style={{
                        backgroundColor: this.props.headerOverlayColor || 'transparent'
                    }}
                ></motion.div>}
                
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
                            ease: window.onFirstMounted || mounted ? [0.5, 0.025, 0, 1] : [1, .1, .35, 1],
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
                                delay: .5 + (window.onFirstMounted || mounted || isNavToggling || window.translateWithToggleNav ? .0 : .5),
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
                            
                            
                            { isToggleNavContext && <motion.div
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
                                    opacity: 0
                                }}
                            >
                                <FontAwesomeIcon icon={faChevronUp}/>
                            </motion.div>}
                            
                            { !isToggleNavContext && <motion.div
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
                                    opacity: 0
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

PageContainer.contextType = AppMainContext;

export default PageContainer;

const WrapPageScroll = ({ children, crrPathName, refSmooth }: {
    children: React.ReactNode
    crrPathName: string
    refSmooth: React.RefObject<HTMLDivElement>
}) => {

    const appContext: IThemeState = React.useContext(AppMainContext);

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
    // console.log(scrollY)
    return (
        <motion.div
            ref={refSmooth}
            // className="scroll-container"
            style={{
                y: -scrollY.get() * 0.00005,
            }}
        >
            {children}
        </motion.div>
    ); 
}