import React from 'react'
import PostAddIcon from '@mui/icons-material/PostAdd'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import './EditPage.css'

const EditPage = () => {
    var containers = [
        {
            key: 'shifs',
            title: 'שמירות',
            features: [
                {
                    header: 'הוסף פוטנציאל',
                    icon: <PostAddIcon style={{ fontSize: 60 }} />,
                    onClick: () => { },
                },
                {
                    header: 'ערוך סוגי שמירות',
                    icon: <LibraryAddCheckIcon style={{ fontSize: 60 }} />,
                    onClick: () => console.log('edit print'),
                },
                {
                    header: 'ייצא פוטנציאל לאקסל',
                    icon: <LibraryAddCheckIcon style={{ fontSize: 60 }} />,
                    onClick: () => { },
                },
                {
                    header: 'ייבוא פוטנציאל לאקסל',
                    icon: <LibraryAddCheckIcon style={{ fontSize: 60 }} />,
                    onClick: () => { },
                },
            ],
        },
    ]

    return (
        <div>
            <div className="main-container">
                {containers.map((container) => (
                    <div key={container.key} className="cards-container">
                        <h4>{container.title}</h4>
                        {container.features.map((btn) => (
                            <div key={btn.header} onClick={btn.onClick} className="add-card">
                                <h3>{btn.header}</h3>
                                {btn.icon}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EditPage
