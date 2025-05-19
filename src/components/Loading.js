import { CSpinner } from '@coreui/react';
import React from 'react';

const Loading = () => {
    return (
        <div className="text-center">
            <CSpinner size="sm" style={{ width: '5rem', height: '5rem' }} />
        </div>
    );
};

export default Loading;
