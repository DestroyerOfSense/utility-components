import React from "react";

/*
 * interface Toggleable
 * {
 *     controlHandler?: string;
 *     toggledOn: boolean;
 * }
 */

/*
 * When this component is toggled on or off (by re-rendering with the appropriate value of `props.toggledOn`), its
 * toggleable children are toggled on or off as well.
 *
 * A component is toggleable if its `props` implements `Toggleable`, as defined in the above comment. It is assumed
 * that, when its `props.toggledOn` is true, the component renders differently than when it is false, but this is not
 * technically required.
 *
 * When a `ToggleGroup` is rendered, if its toggleable child's `props` contains `controlHandler`, the child is checked
 * for a property of that name. If the property exists, it must be a string containing a valid event handler script. The
 * property is replaced with a function that executes said code if it exists, and then executes the `ToggleGroup`'s
 * `onToggle` property. Regardless of whether `controlHandler` is defined, the child's `toggledOn` property is redefined
 * to match that of the `ToggleGroup`.
 *
 * Properties
 * ----------
 * onToggle: (event: React.SyntheticEvent<EventTarget>, ...rest: any[]) => any - If the child's event handler is exposed
 *      via `controlHandler`, this function is called afterwards whenever the corresponding event occurs.
 * toggledOn: boolean
 */
export default function ToggleGroup(props)
{
    let renderedChildren = React.Children.map(props.children, function(child)
    {
        let newProps = {};
        let controlHandlerName = child.props.controlHandler;
        if (controlHandlerName)
        {
            let controlHandler = child.props[controlHandlerName];
            switch (typeof controlHandler)
            {
                default:
                    controlHandler = ';';
                case "string":
                    controlHandler = new Function(controlHandler);
                case "function":
                    newProps[controlHandlerName] = function(event, ...rest)
                    {
                        controlHandler(event, ...rest);
                        props.onToggle(event, ...rest);
                    };
            }
        }
        newProps.toggledOn = props.toggledOn;
        // Note that the child is cloned rather than directly modified, in keeping with React best practices.
        return React.cloneElement(child, newProps);
    });
    return <React.Fragment>{renderedChildren}</React.Fragment>;
}
