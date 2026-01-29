import React, { Fragment } from 'react';
import { Link } from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
import {CommentsController, ViewCommentsController} from '../../../../common/mobile/lib/controller/collaboration/Comments';
import SvgIcon from '@common/lib/component/SvgIcon';
import IconEditSettingsIos from '@common-ios-icons/icon-edit-settings.svg?ios';
import IconEditSettingsAndroid from '@common-android-icons/icon-edit-settings.svg';
import IconAddOtherIos from '@common-ios-icons/icon-add-other.svg?ios';
import IconAddOtherAndroid from '@common-android-icons/icon-add-other.svg';
import IconUndoIos from '@common-ios-icons/icon-undo.svg?ios';
import IconUndoAndroid from '@common-android-icons/icon-undo.svg';
import IconRedoIos from '@common-ios-icons/icon-redo.svg?ios';
import IconRedoAndroid from '@common-android-icons/icon-redo.svg';

export const getToolbarOptions = ({ disabled, onEditClick, onAddClick }) => {
    return (
        <Fragment>
            <Link iconOnly key='btn-edit' className={disabled ? 'disabled' : ''} href={false} onClick={onEditClick}>
                {Device.ios ?
                    <SvgIcon slot="media" symbolId={IconEditSettingsIos.id} className={'icon icon-svg'} /> :
                    <SvgIcon slot="media" symbolId={IconEditSettingsAndroid.id} className={'icon icon-svg'} />
                }
            </Link>
            <Link iconOnly key='btn-add' className={disabled ? 'disabled' : ''} href={false} onClick={onAddClick}>
                {Device.ios ?
                    <SvgIcon slot="media" symbolId={IconAddOtherIos.id} className={'icon icon-svg'} /> :
                    <SvgIcon slot="media" symbolId={IconAddOtherAndroid.id} className={'icon icon-svg'} />
                }
            </Link>
        </Fragment>
    );
};

export const getUndoRedo = ({ disabledUndo, disabledRedo, onUndoClick, onRedoClick }) => {
    return (
        <Fragment>
            <Link iconOnly key='btn-undo' className={disabledUndo ? 'disabled' : ''} href={false} onClick={onUndoClick}>
                {Device.ios ?
                    <SvgIcon slot="media" symbolId={IconUndoIos.id} className={'icon icon-svg'} /> :
                    <SvgIcon slot="media" symbolId={IconUndoAndroid.id} className={'icon icon-svg'} />
                }
            </Link>
            <Link iconOnly key='btn-redo' className={disabledRedo ? 'disabled' : ''} href={false} onClick={onRedoClick}>
                {Device.ios ?
                    <SvgIcon slot="media" symbolId={IconRedoIos.id} className={'icon icon-svg'} /> :
                    <SvgIcon slot="media" symbolId={IconRedoAndroid.id} className={'icon icon-svg'} />
                }
            </Link>
        </Fragment>
    );
};

export const initThemeColors = () => {
    Common.EditorApi.get().asc_registerCallback('asc_onSendThemeColors', (colors, standartColors) => {
        Common.Utils.ThemeColor.setColors(colors, standartColors);
    });
};

export const initFonts = (storeTextSettings) => {
    const api = Common.EditorApi.get();
    api.asc_registerCallback('asc_onInitEditorFonts', (fonts, select) => {
        storeTextSettings.initEditorFonts(fonts, select);
    });
};

export const initEditorStyles = (storeParagraphSettings) => {
    const api = Common.EditorApi.get();
    api.asc_setParagraphStylesSizes(330, 38);
    api.asc_registerCallback('asc_onInitEditorStyles', (styles) => {
        storeParagraphSettings.initEditorStyles(styles);
    });
    api.asc_registerCallback('asc_onParaStyleName', (name) => {
        storeParagraphSettings.changeParaStyleName(name);
    });
};

export const initFocusObjects = (storeFocusObjects) => {
    Common.EditorApi.get().asc_registerCallback('asc_onFocusObject', (objects) => {
        storeFocusObjects.resetFocusObjects(objects);
    });
    storeFocusObjects.intf = {};
    storeFocusObjects.intf.filterFocusObjects = () => {
        const arr = [];
        for (let object of storeFocusObjects._focusObjects) {
            let type = object.get_ObjectType();
            if (Asc.c_oAscTypeSelectElement.Paragraph === type) {
                arr.push('text', 'paragraph');
            } else if (Asc.c_oAscTypeSelectElement.Table === type) {
                arr.push('table');
            } else if (Asc.c_oAscTypeSelectElement.Image === type) {
                if (object.get_ObjectValue().get_ChartProperties()) {
                    let idx = arr.indexOf('shape');
                    if (idx < 0) {
                        arr.push('chart');
                    } else {
                        arr.splice(idx, 1, 'chart');
                    }
                } else if (object.get_ObjectValue().get_ShapeProperties() && !arr.includes('chart')) {
                    arr.push('shape');
                } else {
                    arr.push('image');
                }
            } else if (Asc.c_oAscTypeSelectElement.Hyperlink === type) {
                arr.push('hyperlink');
            } else if (Asc.c_oAscTypeSelectElement.Header === type) {
                arr.push('header');
            }
        }
        return arr.filter((value, index, self) => self.indexOf(value) === index);
    };
    storeFocusObjects.intf.getHeaderObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Header) {
                matches.push(object);
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
    storeFocusObjects.intf.getParagraphObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Paragraph) {
                matches.push(object);
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
    storeFocusObjects.intf.getShapeObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Image &&
                object.get_ObjectValue() && object.get_ObjectValue().get_ShapeProperties()) {
                matches.push(object);
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
    storeFocusObjects.intf.getImageObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Image) {
                const val = object.get_ObjectValue();
                if (val && val.get_ShapeProperties() === null && val.get_ChartProperties() === null) {
                    matches.push(object);
                }
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
    storeFocusObjects.intf.getTableObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Table) {
                matches.push(object);
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
    storeFocusObjects.intf.getChartObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() === Asc.c_oAscTypeSelectElement.Image &&
                object.get_ObjectValue() && object.get_ObjectValue().get_ChartProperties()) {
                matches.push(object);
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
    storeFocusObjects.intf.getLinkObject = () => {
        const matches = [];
        for (let object of storeFocusObjects._focusObjects) {
            if (object.get_ObjectType() == Asc.c_oAscTypeSelectElement.Hyperlink) {
                matches.push(object);
            }
        }
        if (matches.length > 0) {
            return matches[matches.length - 1].get_ObjectValue();
        }
    };
};

export const initTableTemplates = (storeTableSettings) => {
    const api = Common.EditorApi.get();
    api.asc_registerCallback('asc_onInitTableTemplates', (styles) => {
        storeTableSettings.initTableTemplates(styles);
    });
};

export const updateChartStyles = (storeChartSettings, storeFocusObjects) => {
    const api = Common.EditorApi.get();
    api.asc_registerCallback('asc_onUpdateChartStyles', () => {
        if (storeChartSettings.chartObject && storeChartSettings.chartObject.get_ChartProperties()) {
            storeChartSettings.updateChartStyles(
                api.asc_getChartPreviews(storeFocusObjects.chartObject.get_ChartProperties().getType())
            );
        }
    });
};

export const getEditCommentControllers = () => {
    return (
        <Fragment>
            <CommentsController />
            <ViewCommentsController />
        </Fragment>
    );
};

export const ContextMenu = {
    mapMenuItems(controller) {
        const { t, isDisconnected, canViewComments, canCoAuthoring, canComments, isProtected, typeProtection } = controller.props;
        const _t = t("ContextMenu", {returnObjects: true});
        const api = Common.EditorApi.get();
        const stack = api.getSelectedElements();
        const canCopy = api.can_CopyCut();
        const isAllowedEditing = !isProtected || typeProtection === Asc.c_oAscEDocProtect.TrackedChanges;

        let isText = false,
            isObject = false,
            isLink = false,
            locked = false;

        stack.forEach(item => {
            const objectType = item.get_ObjectType(),
                objectValue = item.get_ObjectValue();
            if (objectType === Asc.c_oAscTypeSelectElement.Header) {
                locked = objectValue.get_Locked();
            } else if (objectType === Asc.c_oAscTypeSelectElement.Paragraph) {
                locked = objectValue.get_Locked();
                isText = true;
            } else if (objectType === Asc.c_oAscTypeSelectElement.Image || objectType === Asc.c_oAscTypeSelectElement.Table) {
                locked = objectValue.get_Locked();
                isObject = true;
            } else if (objectType === Asc.c_oAscTypeSelectElement.Hyperlink) {
                isLink = true;
            }
        });

        let itemsIcon = [],
            itemsText = [];

        if (canCopy) {
            itemsIcon.push({ event: 'copy', icon: 'icon-copy' });
        }

        if (!isDisconnected) {
            if (canCopy && !locked && isAllowedEditing) {
                itemsIcon.push({ event: 'cut', icon: 'icon-cut' });
            }
            if (!locked && isAllowedEditing) {
                itemsIcon.push({ event: 'paste', icon: 'icon-paste' });
            }
            if (canViewComments && controller.isComments) {
                itemsText.push({ caption: _t.menuViewComment, event: 'viewcomment' });
            }
            if (api.can_AddQuotedComment() !== false && canCoAuthoring && canComments && !locked && !(!isText && isObject)) {
                itemsText.push({ caption: _t.menuAddComment, event: 'addcomment' });
            }
        }

        if (isLink) {
            itemsText.push({ caption: _t.menuOpenLink, event: 'openlink' });
            if (isAllowedEditing) {
                itemsText.push({ caption: t('ContextMenu.menuEditLink'), event: 'editlink' });
            }
        }

        return itemsIcon.concat(itemsText);
    },

    handleMenuItemClick(controller, action) {
        return false;
    },
};
