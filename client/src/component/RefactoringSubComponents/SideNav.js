import React, {useState} from "react";
import "./subComponentCSS.css";
     
const NavLink = props => {
    const [showChildren, setShowChildren] = useState(false)
    const {item, depth, onLinkClick, setPackages} = props
    const {name, children, umlImgBefore, umlImgAfter} = item

    const linkHandler = e => {
        e.preventDefault()
        if (children) {
            // Toggle visibility of children items
            onLinkClick(null)
            setShowChildren(val => !val)
        } else {
            // Triggered when the item has no children
            onLinkClick(item)
            setPackages({})
        }
        // Set images before and after to display them
        if (umlImgBefore || umlImgAfter) setPackages({umlImgBefore, umlImgAfter})
    }
    
    return (
       <>
        <div style={{ 'paddingLeft': `${10 * depth}px` }}>
            <button onClick={linkHandler} className="nav-link navi-item d-flex align-left">{name}</button>
        </div>
        {showChildren && Array.isArray(children) ? (
            children.map((item) => {
                return <NavLink key={item.name} item={item} depth={depth + 1} onLinkClick={onLinkClick} setPackages={setPackages} />
            })
        ) : null}
       </>
    )
}

const SideNav = props => {
    const {data: navItems, onLinkClick, setPackages} = props;

    return (
        <div>
            <ul className="px-0">
                {navItems.map(item => {
                    return <NavLink key={item.name} item={item} depth={1} onLinkClick={onLinkClick} setPackages={setPackages}  />
                })}
            </ul>
        </div>
      );
}

export default SideNav;
