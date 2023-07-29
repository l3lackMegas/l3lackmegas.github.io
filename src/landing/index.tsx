import * as React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import './index.scss';

import { TextColor, IThemeState } from '../context';

import PageContainer from '../common/PageContainer';

type PageProps = {
};
type PageState = {
    
};
class LandingPage extends React.Component<PageProps, PageState, IThemeState> {
    context!: IThemeState;

    state: PageState = {
        
    };

    componentDidMount() {
        const { setTextColor, setCrrFeature }: IThemeState = this.context;
        setTextColor('white');
        setCrrFeature('/');
    }

    componentWillUnmount(): void {
        const { setTextColor, crrFeature, setCrrFeature }: IThemeState = this.context;
        if(crrFeature === '/') {
            setTextColor('white');
        }
    }

    render() {
        return (
            <PageContainer>
                <motion.div
                    className='landing-page'
                    key={'landingPage'}
                >

                </motion.div>
            </PageContainer>
        );
    }
}

LandingPage.contextType = TextColor;

export default LandingPage;