import React from 'react';
import { Link } from 'react-router-dom';

// function component
export default () => {
    return (
        <div>
            This is some other page.
            <Link to="/">Go back to the home page</Link>
        </div>
    );
}