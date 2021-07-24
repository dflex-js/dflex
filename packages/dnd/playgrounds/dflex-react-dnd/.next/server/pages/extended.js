(function() {
var exports = {};
exports.id = "pages/extended";
exports.ids = ["pages/extended"];
exports.modules = {

/***/ "./pages/extended.tsx":
/*!****************************!*\
  !*** ./pages/extended.tsx ***!
  \****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_extended__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/extended */ "./src/extended/index.ts");
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

/* harmony default export */ __webpack_exports__["default"] = (_src_extended__WEBPACK_IMPORTED_MODULE_0__.default);

/***/ }),

/***/ "./src/DnDComponent.tsx":
/*!******************************!*\
  !*** ./src/DnDComponent.tsx ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TodoItem": function() { return /* binding */ TodoItem; }
/* harmony export */ });
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _dflex_dnd__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dflex/dnd */ "../../dist/index.js");
/* harmony import */ var _dflex_dnd__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_dflex_dnd__WEBPACK_IMPORTED_MODULE_2__);

var _jsxFileName = "D:\\projects\\dflex\\packages\\dnd\\playgrounds\\dflex-react-dnd\\src\\DnDComponent.tsx";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-extraneous-dependencies */

 // shared dragged event

let dndEvent;
const TodoItem = ({
  Component = "li",
  id,
  style,
  className,
  children,
  depth = 0
}) => {
  const taskRef = react__WEBPACK_IMPORTED_MODULE_1___default().useRef();
  react__WEBPACK_IMPORTED_MODULE_1___default().useEffect(() => {
    _dflex_dnd__WEBPACK_IMPORTED_MODULE_2__.store.register({
      id,
      ref: taskRef.current,
      depth
    });
  }, []);

  const onMouseMove = e => {
    // e.stopPropagation();
    if (dndEvent) {
      const {
        clientX,
        clientY
      } = e;
      dndEvent.dragAt(clientX, clientY);
    }
  };

  const onMouseUp = () => {
    if (dndEvent) {
      dndEvent.endDragging();
      dndEvent = null;
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
  };

  const onMouseDown = e => {
    const {
      button,
      clientX,
      clientY
    } = e; // Avoid right mouse click and ensure id

    if (typeof button === "number" && button === 0) {
      if (id) {
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("mousemove", onMouseMove); // document.addEventListener("scroll", onMouseScroll);

        dndEvent = new _dflex_dnd__WEBPACK_IMPORTED_MODULE_2__.DnD(id, {
          x: clientX,
          y: clientY
        });
      }
    }
  };

  const onTouchMove = e => {
    if (dndEvent) {
      const {
        clientX,
        clientY
      } = e.touches[0];
      dndEvent.dragAt(clientX, clientY);
    }
  };

  const onTouchEnd = () => {
    if (dndEvent) {
      dndEvent.endDragging();
      dndEvent = null;
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchmove", onTouchMove);
    }
  };

  const onTouchStart = e => {
    const {
      clientX,
      clientY
    } = e.touches[0];

    if (id) {
      dndEvent = new _dflex_dnd__WEBPACK_IMPORTED_MODULE_2__.DnD(id, {
        x: clientX,
        y: clientY
      });
      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove);
    }
  };

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {
    ref: taskRef,
    id: id,
    onTouchStart: onTouchStart,
    onMouseDown: onMouseDown,
    className: className,
    style: style,
    children: children
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 107,
    columnNumber: 5
  }, undefined);
};
/* harmony default export */ __webpack_exports__["default"] = (TodoItem);

/***/ }),

/***/ "./src/extended/ExtendedList.tsx":
/*!***************************************!*\
  !*** ./src/extended/ExtendedList.tsx ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Demo_module_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Demo.module.css */ "./src/Demo.module.css");
/* harmony import */ var _Demo_module_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Demo_module_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _DnDComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../DnDComponent */ "./src/DnDComponent.tsx");

var _jsxFileName = "D:\\projects\\dflex\\packages\\dnd\\playgrounds\\dflex-react-dnd\\src\\extended\\ExtendedList.tsx";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable react/no-array-index-key */




const ExtendedList = () => {
  const tasks = [];

  for (let i = 1; i <= 1000; i += 1) {
    const uni = `${i}-extended`;
    tasks.push({
      id: uni,
      key: uni,
      task: `${i}`
    });
  }

  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
    className: (_Demo_module_css__WEBPACK_IMPORTED_MODULE_3___default().root),
    children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("div", {
      className: (_Demo_module_css__WEBPACK_IMPORTED_MODULE_3___default().todo),
      children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("ul", {
        children: tasks.map(({
          task,
          id,
          key
        }) => /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_DnDComponent__WEBPACK_IMPORTED_MODULE_2__.default, {
          id: id,
          children: task
        }, key, false, {
          fileName: _jsxFileName,
          lineNumber: 28,
          columnNumber: 13
        }, undefined))
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 26,
        columnNumber: 9
      }, undefined)
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 25,
      columnNumber: 7
    }, undefined)
  }, void 0, false, {
    fileName: _jsxFileName,
    lineNumber: 24,
    columnNumber: 5
  }, undefined);
};

/* harmony default export */ __webpack_exports__["default"] = (ExtendedList);

/***/ }),

/***/ "./src/extended/index.ts":
/*!*******************************!*\
  !*** ./src/extended/index.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport safe */ _ExtendedList__WEBPACK_IMPORTED_MODULE_0__.default; }
/* harmony export */ });
/* harmony import */ var _ExtendedList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExtendedList */ "./src/extended/ExtendedList.tsx");
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */


/***/ }),

/***/ "./src/Demo.module.css":
/*!*****************************!*\
  !*** ./src/Demo.module.css ***!
  \*****************************/
/***/ (function(module) {

// Exports
module.exports = {
	"root": "Demo_root__1X9uw",
	"todo": "Demo_todo__1gYdl",
	"nested": "Demo_nested__2OY5J"
};


/***/ }),

/***/ "../../../core-instance/dist/AbstractCoreInstance.js":
/*!***********************************************************!*\
  !*** ../../../core-instance/dist/AbstractCoreInstance.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * This is the link (bridge) between the Store and element actions/classes.
 * Abstract is essential for Draggable & extended Store.
 */
var AbstractCoreInstance = /** @class */ (function () {
    /**
     * Creates an instance of AbstractCoreInstance.
     */
    function AbstractCoreInstance(_a) {
        var ref = _a.ref, id = _a.id, depth = _a.depth;
        this.ref = ref;
        this.id = id;
        this.depth = depth;
        /**
         * Since element render once and being transformed later we keep the data
         * stored to navigate correctly.
         */
        this.translateY = 0;
        this.translateX = 0;
    }
    return AbstractCoreInstance;
}());
exports.default = AbstractCoreInstance;
//# sourceMappingURL=AbstractCoreInstance.js.map

/***/ }),

/***/ "../../../core-instance/dist/CoreInstance.js":
/*!***************************************************!*\
  !*** ../../../core-instance/dist/CoreInstance.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/* eslint-disable no-param-reassign */
var AbstractCoreInstance_1 = __importDefault(__webpack_require__(/*! ./AbstractCoreInstance */ "../../../core-instance/dist/AbstractCoreInstance.js"));
var CoreInstance = /** @class */ (function (_super) {
    __extends(CoreInstance, _super);
    function CoreInstance(elementWithPointer, isPause) {
        if (isPause === void 0) { isPause = false; }
        var _this = this;
        var order = elementWithPointer.order, keys = elementWithPointer.keys, element = __rest(elementWithPointer, ["order", "keys"]);
        _this = _super.call(this, element) || this;
        _this.prevTranslateY = [];
        _this.offset = {
            height: 0,
            width: 0,
            left: 0,
            top: 0,
        };
        _this.order = order;
        _this.keys = keys;
        _this.isVisible = !isPause;
        if (_this.ref && _this.isVisible) {
            _this.initIndicators();
            _this.ref.dataset.index = "" + _this.order.self;
        }
        return _this;
    }
    /**
     * Initializes the element offset only when it's called. Since it is sorting
     * different numbers related to transformation we don't need to invoke for
     * idle element because it's costly.
     *
     * So, basically any working element in DnD should be initiated first.
     */
    CoreInstance.prototype.initIndicators = function () {
        var _a = this.ref.getBoundingClientRect(), height = _a.height, width = _a.width, left = _a.left, top = _a.top;
        /**
         * Element offset stored once without being triggered to re-calculate.
         * Instead, using currentOffset object as indicator to current
         * offset/position. This offset, is the init-offset.
         */
        this.offset = {
            height: height,
            width: width,
            left: Math.abs(left),
            top: Math.abs(top),
        };
        this.currentTop = this.offset.top;
        this.currentLeft = this.offset.left;
    };
    CoreInstance.prototype.visibilityHasChanged = function (isVisible) {
        if (isVisible === this.isVisible)
            return;
        if (isVisible && !this.isVisible) {
            this.transformElm();
        }
        this.isVisible = isVisible;
    };
    CoreInstance.prototype.updateCurrentIndicators = function (topSpace, leftSpace) {
        this.translateY += topSpace;
        this.translateX += leftSpace;
        var _a = this.offset, left = _a.left, top = _a.top;
        /**
         * This offset related directly to translate Y and Y. It's isolated from
         * element current offset and effects only top and left.
         */
        this.currentTop = top + this.translateY;
        this.currentLeft = left + this.translateX;
    };
    CoreInstance.prototype.transformElm = function () {
        this.ref.style.transform = "translate3d(" + this.translateX + "px," + this.translateY + "px, 0)";
    };
    /**
     *  Update element index in order  branch
     *
     * @param i - index
     */
    CoreInstance.prototype.updateOrderIndexing = function (i) {
        var oldIndex = this.order.self;
        var newIndex = oldIndex + i;
        this.order.self = newIndex;
        return { oldIndex: oldIndex, newIndex: newIndex };
    };
    CoreInstance.prototype.assignNewPosition = function (branchIDsOrder, newIndex, oldIndex, siblingsEmptyElmIndex) {
        if (oldIndex === void 0) { oldIndex = -1; }
        if (siblingsEmptyElmIndex === void 0) { siblingsEmptyElmIndex = -1; }
        if (newIndex < 0 || newIndex > branchIDsOrder.length - 1) {
            if (true) {
                // eslint-disable-next-line no-console
                console.error("Illegal Attempt: Received an index:" + newIndex + " on siblings list:" + (branchIDsOrder.length - 1));
            }
            return siblingsEmptyElmIndex;
        }
        if (oldIndex > -1) {
            if (siblingsEmptyElmIndex >= 0 && siblingsEmptyElmIndex !== newIndex) {
                if (true) {
                    // eslint-disable-next-line no-console
                    console.error("Illegal Attempt: More than one element have left the siblings list");
                }
                return siblingsEmptyElmIndex;
            }
            branchIDsOrder[oldIndex] = "";
        }
        else if (branchIDsOrder[newIndex].length > 0) {
            if (true) {
                // eslint-disable-next-line no-console
                console.error("Illegal Attempt: Colliding in positions");
            }
            return siblingsEmptyElmIndex;
        }
        branchIDsOrder[newIndex] = this.id;
        this.ref.dataset.index = "" + newIndex;
        return oldIndex;
    };
    /**
     *  Set a new translate position and store the old one.
     *
     * @param topSpace -
     * @param operationID  - Only if moving to a new position.
     */
    CoreInstance.prototype.seTranslate = function (topSpace, operationID) {
        if (operationID) {
            this.prevTranslateY.push({
                ID: operationID,
                translateY: this.translateY,
            });
        }
        this.updateCurrentIndicators(topSpace, 0);
        if (this.isVisible)
            this.transformElm();
    };
    /**
     * Sets new vertical position. Which includes, TranslateY and OffsetTop. By assigning the
     * new calculated value by +/- new difference.
     *
     * Note: Why we don't need setXPosition?
     * Because, elements always move in the same list container, the only one who's migrated to
     * another is dragged.
     *
     * Note: isShuffle is flag made for updating last element in array
     * which is dragged. Normally, update element position and clear its previous
     * position but when updating last element the array is ready and done we need
     * to update one position only so don't clear previous.
     *
     * @param iDsInOrder -
     * @param sign - (+1/-1)
     * @param topSpace - space between dragged and the immediate next element.
     * @param operationID - A unique ID used to store translate history
     * @param vIncrement - the number of passed elements.
     * @param isShuffle -
     */
    CoreInstance.prototype.setYPosition = function (iDsInOrder, sign, topSpace, operationID, siblingsEmptyElmIndex, vIncrement, isShuffle) {
        if (siblingsEmptyElmIndex === void 0) { siblingsEmptyElmIndex = -1; }
        if (vIncrement === void 0) { vIncrement = 1; }
        if (isShuffle === void 0) { isShuffle = true; }
        this.seTranslate(sign * topSpace, operationID);
        var _a = this.updateOrderIndexing(sign * vIncrement), oldIndex = _a.oldIndex, newIndex = _a.newIndex;
        var newStatusSiblingsHasEmptyElm = this.assignNewPosition(iDsInOrder, newIndex, isShuffle ? oldIndex : undefined, siblingsEmptyElmIndex);
        return newStatusSiblingsHasEmptyElm;
    };
    /**
     * Roll back element position vertically(y).
     *
     * @param operationID -
     */
    CoreInstance.prototype.rollYBack = function (operationID) {
        if (this.prevTranslateY.length === 0 ||
            this.prevTranslateY[this.prevTranslateY.length - 1].ID !== operationID) {
            return;
        }
        // @ts-ignore
        var translateY = this.prevTranslateY.pop().translateY;
        var topSpace = translateY - this.translateY;
        var increment = topSpace > 0 ? 1 : -1;
        this.seTranslate(topSpace);
        this.updateOrderIndexing(increment);
        this.rollYBack(operationID);
    };
    return CoreInstance;
}(AbstractCoreInstance_1.default));
exports.default = CoreInstance;
//# sourceMappingURL=CoreInstance.js.map

/***/ }),

/***/ "../../../core-instance/dist/index.js":
/*!********************************************!*\
  !*** ../../../core-instance/dist/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var CoreInstance_1 = __webpack_require__(/*! ./CoreInstance */ "../../../core-instance/dist/CoreInstance.js");
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(CoreInstance_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../dist/DnD.js":
/*!*************************!*\
  !*** ../../dist/DnD.js ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Draggable_1 = __importDefault(__webpack_require__(/*! ./Draggable */ "../../dist/Draggable/index.js"));
var Droppable_1 = __importDefault(__webpack_require__(/*! ./Droppable */ "../../dist/Droppable/index.js"));
var DnDStore_1 = __importDefault(__webpack_require__(/*! ./DnDStore */ "../../dist/DnDStore/index.js"));
var defaultOpts = Object.freeze({
    thresholds: {
        vertical: 60,
        horizontal: 60,
    },
    restrictions: {
        allowLeavingFromTop: true,
        allowLeavingFromBottom: true,
        allowLeavingFromLeft: true,
        allowLeavingFromRight: true,
    },
    scroll: {
        enable: true,
        speed: 10,
        threshold: 50,
    },
});
var DnD = /** @class */ (function (_super) {
    __extends(DnD, _super);
    /**
     *
     * @param id -
     * @param initCoordinates -
     * @param opts -
     */
    function DnD(id, initCoordinates, opts) {
        if (opts === void 0) { opts = defaultOpts; }
        var _this = this;
        var elmCoreInstanceWithTree = DnDStore_1.default.getElmTreeById(id);
        var options = __assign({}, opts);
        Object.keys(defaultOpts).forEach(function (props) {
            if (!options[props]) {
                options[props] = defaultOpts[props];
            }
            else {
                options[props] = __assign(__assign({}, defaultOpts[props]), options[props]);
            }
        });
        var draggable = new Draggable_1.default(elmCoreInstanceWithTree, initCoordinates, options);
        _this = _super.call(this, draggable) || this;
        return _this;
    }
    return DnD;
}(Droppable_1.default));
exports.default = DnD;
//# sourceMappingURL=DnD.js.map

/***/ }),

/***/ "../../dist/DnDStore/DnDStoreImp.js":
/*!******************************************!*\
  !*** ../../dist/DnDStore/DnDStoreImp.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var store_1 = __importDefault(__webpack_require__(/*! @dflex/store */ "../../../store/dist/index.js"));
var core_instance_1 = __importDefault(__webpack_require__(/*! @dflex/core-instance */ "../../../core-instance/dist/index.js"));
var Tracker_1 = __importDefault(__webpack_require__(/*! ./Tracker */ "../../dist/DnDStore/Tracker.js"));
// import Environment from "../Environment";
// function noop() {}
// const handlers = ["onDragOver", "onDragLeave"];
function canUseDOM() {
    return (typeof window !== "undefined" &&
        typeof window.document !== "undefined" &&
        typeof window.document.createElement !== "undefined");
}
var DnDStoreImp = /** @class */ (function (_super) {
    __extends(DnDStoreImp, _super);
    function DnDStoreImp() {
        var _this = _super.call(this) || this;
        _this.siblingsBoundaries = {};
        _this.tracker = new Tracker_1.default();
        _this.initELmIndicator();
        _this.animatedScroll = _this.animatedScroll.bind(_this);
        _this.setViewport = _this.setViewport.bind(_this);
        _this.isDOM = canUseDOM();
        if (_this.isDOM) {
            _this.init();
        }
        _this.throttle = false;
        return _this;
    }
    DnDStoreImp.prototype.init = function () {
        this.setViewport();
        this.setScrollXY();
        window.addEventListener("resize", this.setViewport);
        window.addEventListener("scroll", this.animatedScroll);
        window.onbeforeunload = this.cleanup;
    };
    DnDStoreImp.prototype.setViewport = function () {
        this.viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        this.viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    };
    DnDStoreImp.prototype.setScrollXY = function () {
        this.scrollY = Math.round(document.documentElement.scrollTop || window.pageYOffset);
        this.scrollX = Math.round(document.documentElement.scrollLeft || window.pageXOffset);
    };
    DnDStoreImp.prototype.initELmIndicator = function () {
        this.elmIndicator = {
            currentKy: "",
            prevKy: "",
            exceptionToNextElm: false,
        };
    };
    DnDStoreImp.prototype.isElementHiddenInViewport = function (currentTop, currentLeft) {
        return (currentTop < this.scrollY ||
            currentTop >= this.viewportHeight + this.scrollY ||
            currentLeft < this.scrollX ||
            currentLeft >= this.viewportWidth + this.scrollX);
    };
    DnDStoreImp.prototype.updateRegisteredLayoutIndicators = function () {
        var _this = this;
        this.initELmIndicator();
        Object.keys(this.DOMGen.branches).forEach(function (branchKey) {
            // Ignore non array branches.
            if (Array.isArray(_this.DOMGen.branches[branchKey])) {
                var prevIndex_1 = 0;
                _this.DOMGen.branches[branchKey].forEach(function (elmID, i) {
                    if (elmID.length > 0) {
                        var _a = _this.registry[elmID], currentTop = _a.currentTop, currentLeft = _a.currentLeft;
                        var isVisible = !_this.isElementHiddenInViewport(currentTop, currentLeft);
                        if (!isVisible &&
                            !_this.elmIndicator.exceptionToNextElm &&
                            i > prevIndex_1) {
                            _this.elmIndicator.exceptionToNextElm = true;
                            isVisible = true;
                        }
                        else if (isVisible && _this.elmIndicator.exceptionToNextElm) {
                            // In this case, we are moving from hidden to visible.
                            // Eg: 1, 2 are hidden the rest of the list is visible.
                            // But, there's a possibility that the rest of the branch elements
                            // are hidden.
                            // Eg: 1, 2: hidden 3, 4, 5, 6, 7:visible 8, 9, 10: hidden.
                            _this.initELmIndicator();
                        }
                        _this.registry[elmID].visibilityHasChanged(isVisible);
                        prevIndex_1 = i;
                    }
                });
            }
        });
    };
    DnDStoreImp.prototype.assignSiblingsBoundaries = function (siblingsK, elemOffset) {
        var elmRight = elemOffset.left + elemOffset.width;
        if (!this.siblingsBoundaries[siblingsK]) {
            this.siblingsBoundaries[siblingsK] = {
                top: elemOffset.top,
                maxLeft: elemOffset.left,
                minRight: elmRight,
                bottom: elemOffset.height,
            };
            return;
        }
        var $ = this.siblingsBoundaries[siblingsK];
        if ($.maxLeft < elemOffset.left) {
            $.maxLeft = elemOffset.left;
        }
        if ($.minRight > elmRight) {
            $.minRight = elmRight;
        }
        if ($.top > elemOffset.top) {
            $.top = elemOffset.top;
        }
        else {
            $.bottom = elemOffset.top + elemOffset.height;
        }
    };
    /**
     * Reattach element reference.
     * This happens when element is unmounted from the screen and mounted again.
     *
     * @param id -
     * @param elmRef -
     */
    DnDStoreImp.prototype.reattachElmRef = function (id, elmRef) {
        this.registry[id].ref = elmRef;
        // Preserves last changes.
        this.registry[id].transformElm();
    };
    /**
     *  Register DnD element.
     *
     * @param element -
     */
    DnDStoreImp.prototype.register = function (element) {
        if (!this.isDOM) {
            this.isDOM = canUseDOM();
            if (!this.isDOM)
                return;
            this.init();
        }
        /**
         * If element already exist in the store, then the reattach the reference.
         */
        var id = element.id || element.ref.id;
        if (this.registry[id]) {
            if (element.ref) {
                if (this.registry[id].ref.isEqualNode(element.ref)) {
                    this.reattachElmRef(id, element.ref);
                }
                else {
                    throw new Error("DFlex: Element with id:" + id + " is already registered. Please, provide DFlex with a unique id.");
                }
            }
            return;
        }
        _super.prototype.register.call(this, element, core_instance_1.default);
        var _a = this.registry[id], currentTop = _a.currentTop, currentLeft = _a.currentLeft, offset = _a.offset, _b = _a.keys, sK = _b.sK, pK = _b.pK;
        this.assignSiblingsBoundaries(sK, offset);
        var isVisible = !this.isElementHiddenInViewport(currentTop, currentLeft);
        // same branch
        this.elmIndicator.currentKy = "" + sK + pK;
        if (!isVisible &&
            !this.elmIndicator.exceptionToNextElm &&
            this.elmIndicator.currentKy === this.elmIndicator.prevKy) {
            this.elmIndicator.exceptionToNextElm = true;
            isVisible = true;
        }
        this.registry[id].isVisible = isVisible;
        this.elmIndicator.prevKy = this.elmIndicator.currentKy;
    };
    DnDStoreImp.prototype.getELmOffsetById = function (id) {
        return this.getElmById(id).offset;
    };
    DnDStoreImp.prototype.getELmTranslateById = function (id) {
        var _a = this.getElmById(id), translateX = _a.translateX, translateY = _a.translateY;
        return { translateX: translateX, translateY: translateY };
    };
    DnDStoreImp.prototype.getElmSiblingsById = function (id) {
        var element = this.getElmById(id);
        var sK = element.keys.sK;
        var siblings = this.getElmBranchByKey(sK);
        return siblings;
    };
    /**
     * Gets element connections instance for a given id.
     *
     * @param id -
     */
    DnDStoreImp.prototype.getElmTreeById = function (id) {
        var element = this.getElmById(id);
        var _a = element.keys, sK = _a.sK, pK = _a.pK, pi = element.order.parent;
        /**
         * getting connected branches
         */
        var siblings = this.getElmBranchByKey(sK);
        var parents = this.getElmBranchByKey(pK);
        /**
         * getting parent instance
         */
        var parent = null;
        if (parents !== undefined) {
            var parentsID = Array.isArray(parents) ? parents[pi] : parents;
            parent = this.getElmById(parentsID);
        }
        return {
            element: element,
            parent: parent,
            branches: {
                siblings: siblings,
                parents: parents,
            },
        };
    };
    DnDStoreImp.prototype.animatedScroll = function () {
        var _this = this;
        this.setScrollXY();
        if (!this.throttle) {
            window.requestAnimationFrame(function () {
                _this.updateRegisteredLayoutIndicators();
                _this.throttle = false;
            });
            this.throttle = true;
        }
    };
    DnDStoreImp.prototype.cleanup = function () {
        window.removeEventListener("scroll", this.animatedScroll);
        window.removeEventListener("resize", this.setViewport);
    };
    return DnDStoreImp;
}(store_1.default));
exports.default = (function createStoreInstance() {
    var store = new DnDStoreImp();
    return store;
})();
//# sourceMappingURL=DnDStoreImp.js.map

/***/ }),

/***/ "../../dist/DnDStore/Tracker.js":
/*!**************************************!*\
  !*** ../../dist/DnDStore/Tracker.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Tracker = /** @class */ (function () {
    /**
     * Creates an instance of Tracker.
     */
    function Tracker() {
        this.travelID = 0;
    }
    /**
     * Increment travels and return the last one.
     */
    Tracker.prototype.newTravel = function () {
        this.travelID += 1;
        return "" + this.travelID;
    };
    return Tracker;
}());
exports.default = Tracker;
//# sourceMappingURL=Tracker.js.map

/***/ }),

/***/ "../../dist/DnDStore/index.js":
/*!************************************!*\
  !*** ../../dist/DnDStore/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var DnDStoreImp_1 = __webpack_require__(/*! ./DnDStoreImp */ "../../dist/DnDStore/DnDStoreImp.js");
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(DnDStoreImp_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../dist/Draggable/Base.js":
/*!************************************!*\
  !*** ../../dist/Draggable/Base.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var draggable_1 = __webpack_require__(/*! @dflex/draggable */ "../../../draggable/dist/index.js");
var DnDStore_1 = __importDefault(__webpack_require__(/*! ../DnDStore */ "../../dist/DnDStore/index.js"));
/**
 * Base element.
 *
 * Creates draggedElm and activeParent and initializes thresholds.
 */
var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base(elmTree, initCoordinates, opts) {
        var _this = this;
        var element = elmTree.element, parent = elmTree.parent, _a = elmTree.branches, siblings = _a.siblings, parents = _a.parents;
        _this = _super.call(this, element, initCoordinates) || this;
        var order = element.order;
        _this.opts = opts;
        /**
         * Initialize temp index that refers to element new position after
         * transformation happened.
         */
        _this.tempIndex = order.self;
        _this.parentsList = parents;
        /**
         * Thresholds store, contains max value for each parent and for dragged. Depending on
         * ids as keys.
         */
        _this.thresholds = {
            siblings: {},
            dragged: {
                maxBottom: 0,
                maxTop: 0,
                maxLeft: 0,
                maxRight: 0,
            },
        };
        _this.thresholdsPercentages = {
            vertical: Math.round((_this.opts.thresholds.vertical * _this.draggedElm.offset.height) / 100),
            horizontal: Math.round((_this.opts.thresholds.horizontal * _this.draggedElm.offset.width) / 100),
        };
        /**
         * Init max direction for position
         */
        _this.setThreshold(_this.draggedElm.currentTop, _this.draggedElm.currentLeft);
        var siblingsBoundaries = DnDStore_1.default.siblingsBoundaries[DnDStore_1.default.registry[_this.draggedElm.id].keys.sK];
        _this.setThreshold(siblingsBoundaries.top, siblingsBoundaries.maxLeft, siblingsBoundaries.bottom, DnDStore_1.default.registry[_this.draggedElm.id].keys.sK);
        _this.siblingsList = Array.isArray(siblings) ? siblings : null;
        _this.setIsOrphan(parent);
        _this.operationID = DnDStore_1.default.tracker.newTravel();
        return _this;
    }
    /**
     * Check if dragged has no parent and then set the related operations
     * accordingly.
     *
     * @param parent -
     */
    Base.prototype.setIsOrphan = function (parent) {
        /**
         * Not all elements have parents.
         */
        if (parent) {
            /**
             * Indicator to parents that have changed. This facilitates looping in
             * affected parents only.
             */
            this.setOfTransformedIds = new Set([]);
            this.assignActiveParent(parent);
            this.isOutActiveParent = false;
        }
        else {
            /**
             * Dragged has no parent.
             */
            this.activeParent = null;
        }
    };
    /**
     * Sets thresholds for dragged element position depending on its
     * position inside parent which is related to droppable left and top.
     *
     * @param top -
     * @param left -
     * @param height -
     * @param siblingsK -
     */
    Base.prototype.setThreshold = function (top, left, height, siblingsK) {
        var _a = this.thresholdsPercentages, vertical = _a.vertical, horizontal = _a.horizontal;
        var $;
        if (siblingsK && height) {
            if (!this.thresholds.siblings[siblingsK]) {
                this.thresholds.siblings[siblingsK] = {
                    maxBottom: 0,
                    maxTop: 0,
                    maxLeft: 0,
                    maxRight: 0,
                };
            }
            $ = this.thresholds.siblings[siblingsK];
            $.maxBottom = height - vertical;
        }
        else {
            $ = this.thresholds.dragged;
            /**
             * When going down, currentTop increases (+vertical) with droppable
             * taking into considerations (+ vertical).
             */
            $.maxBottom = top + vertical;
        }
        /**
         * Calculate max-vertical for up and down:
         */
        /**
         * When going up, currentTop decreases (-vertical).
         */
        $.maxTop = top - vertical;
        /**
         * When going left, currentLeft decreases (-horizontal).
         */
        $.maxLeft = left - horizontal;
        /**
         * When going right, currentLeft increases (+horizontal) with droppable
         * taking into considerations (+ horizontal).
         */
        $.maxRight = left + horizontal;
    };
    Base.prototype.isParenOverflowX = function () {
        var parentBottom = this.activeParent.offset.top + this.activeParent.offset.height;
        var elemOverflowX = parentBottom > window.innerHeight;
        return elemOverflowX;
    };
    /**
     * Assigns new ACTIVE_PARENT: parent who contains dragged
     *
     * @param element -
     */
    Base.prototype.assignActiveParent = function (element) {
        /**
         * Assign instance ACTIVE_PARENT which represents droppable. Then
         * assign owner parent so we have from/to.
         */
        this.activeParent = element;
        /**
         * Add flag for undo method so we can check which  parent is being
         * transformed and which is not.
         */
        this.isOutActiveParent = false;
        if (this.opts.scroll.enable) {
            this.opts.scroll.enable = this.opts.scroll.enable
                ? this.isParenOverflowX()
                : false;
        }
    };
    return Base;
}(draggable_1.AbstractDraggable));
exports.default = Base;
//# sourceMappingURL=Base.js.map

/***/ }),

/***/ "../../dist/Draggable/Draggable.js":
/*!*****************************************!*\
  !*** ../../dist/Draggable/Draggable.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var DnDStore_1 = __importDefault(__webpack_require__(/*! ../DnDStore */ "../../dist/DnDStore/index.js"));
var Base_1 = __importDefault(__webpack_require__(/*! ./Base */ "../../dist/Draggable/Base.js"));
var Draggable = /** @class */ (function (_super) {
    __extends(Draggable, _super);
    function Draggable(elmTree, initCoordinates, opts) {
        var _this = _super.call(this, elmTree, initCoordinates, opts) || this;
        var x = initCoordinates.x, y = initCoordinates.y;
        _this.innerOffsetX = x - _this.draggedElm.currentLeft;
        _this.innerOffsetY = y - _this.draggedElm.currentTop;
        _this.tempOffset = {
            currentLeft: _this.draggedElm.currentLeft,
            currentTop: _this.draggedElm.currentTop,
        };
        _this.occupiedOffset = {
            currentLeft: _this.draggedElm.currentLeft,
            currentTop: _this.draggedElm.currentTop,
        };
        _this.occupiedTranslate = {
            translateX: _this.draggedElm.translateX,
            translateY: _this.draggedElm.translateY,
        };
        /**
         * previous X and Y are used to calculate mouse directions.
         */
        _this.prevY = y;
        /**
         * It counts number of element that dragged has passed. This counter is
         * crucial to calculate drag's translate and index
         */
        _this.numberOfElementsTransformed = 0;
        _this.isMovingDown = false;
        _this.isOutPositionHorizontally = false;
        _this.isOutSiblingsHorizontally = false;
        var $ = _this.opts.restrictions;
        _this.axesFilterNeeded =
            _this.siblingsList !== null &&
                (!$.allowLeavingFromLeft ||
                    !$.allowLeavingFromRight ||
                    !$.allowLeavingFromTop ||
                    !$.allowLeavingFromBottom);
        return _this;
    }
    Draggable.prototype.getLastElmIndex = function () {
        return this.siblingsList.length - 1;
    };
    Draggable.prototype.isFirstOrOutside = function () {
        return this.siblingsList !== null && this.tempIndex <= 0;
    };
    Draggable.prototype.isLastELm = function () {
        return this.tempIndex === this.getLastElmIndex();
    };
    Draggable.prototype.axesRightFilter = function (x, minRight) {
        return x - this.innerOffsetX + this.draggedElm.offset.width >= minRight
            ? -this.outerOffsetX
            : x;
    };
    Draggable.prototype.axesLeftFilter = function (x, maxLeft) {
        return x - this.innerOffsetX <= maxLeft ? -this.outerOffsetX : x;
    };
    Draggable.prototype.containerHorizontalAxesFilter = function (x) {
        var _a = DnDStore_1.default.siblingsBoundaries[DnDStore_1.default.registry[this.draggedElm.id].keys.sK], maxLeft = _a.maxLeft, minRight = _a.minRight;
        var fx = this.opts.restrictions.allowLeavingFromLeft
            ? this.opts.restrictions.allowLeavingFromRight
                ? x
                : this.axesRightFilter(x, minRight)
            : this.axesLeftFilter(x, maxLeft);
        return this.opts.restrictions.allowLeavingFromRight
            ? fx
            : this.axesRightFilter(fx, minRight);
    };
    Draggable.prototype.axesBottomFilter = function (y, bottom) {
        return (this.tempIndex < 0 || this.isLastELm()) &&
            y - this.innerOffsetY + this.draggedElm.offset.height >= bottom
            ? bottom + this.innerOffsetY - this.draggedElm.offset.height
            : y;
    };
    Draggable.prototype.axesTopFilter = function (y, maxTop) {
        return this.tempIndex <= 0 && y - this.innerOffsetY <= maxTop
            ? maxTop + this.innerOffsetY
            : y;
    };
    Draggable.prototype.containerVerticalAxesFilter = function (y) {
        var _a = DnDStore_1.default.siblingsBoundaries[DnDStore_1.default.registry[this.draggedElm.id].keys.sK], top = _a.top, bottom = _a.bottom;
        var fy = this.opts.restrictions.allowLeavingFromTop
            ? this.opts.restrictions.allowLeavingFromBottom
                ? y
                : this.axesBottomFilter(y, bottom)
            : this.axesTopFilter(y, top);
        return this.opts.restrictions.allowLeavingFromBottom
            ? fy
            : this.axesBottomFilter(fy, bottom);
    };
    /**
     * Dragged current-offset is essential to determine dragged position in
     * layout and parent.
     *
     * Is it moved form its translate? Is it out the parent or in
     * another parent? The answer is related to currentOffset.
     *
     * Note: these are the current offset related only to the dragging. When the
     * operation is done, different calculation will be set.
     *
     * @param x -
     * @param y -
     */
    Draggable.prototype.dragAt = function (x, y) {
        var filteredY = y;
        var filteredX = x;
        if (this.axesFilterNeeded) {
            filteredY = this.containerVerticalAxesFilter(y);
            filteredX = this.containerHorizontalAxesFilter(x);
        }
        this.translate(filteredX, filteredY);
        /**
         * Every time we got new translate, offset should be updated
         */
        this.tempOffset.currentLeft = filteredX - this.innerOffsetX;
        this.tempOffset.currentTop = filteredY - this.innerOffsetY;
    };
    Draggable.prototype.isOutThresholdH = function ($) {
        return (this.tempOffset.currentLeft < $.maxLeft ||
            this.tempOffset.currentLeft > $.maxRight);
    };
    Draggable.prototype.isOutPositionV = function ($) {
        return this.isMovingDown
            ? this.tempOffset.currentTop > $.maxBottom
            : this.tempOffset.currentTop < $.maxTop;
    };
    Draggable.prototype.isOutContainerV = function ($) {
        /**
         * Are you last element and outside the container? Or are you coming from top
         * and outside the container?
         */
        return ((this.isLastELm() && this.tempOffset.currentTop > $.maxBottom) ||
            (this.tempIndex < 0 && this.tempOffset.currentTop < $.maxTop));
    };
    Draggable.prototype.isOutPosition = function ($) {
        this.isOutPositionHorizontally = false;
        if (this.isOutThresholdH($)) {
            this.isOutPositionHorizontally = true;
            return true;
        }
        if (this.isOutPositionV($)) {
            return true;
        }
        return false;
    };
    Draggable.prototype.isOutContainer = function ($) {
        this.isOutSiblingsHorizontally = false;
        if (this.isOutContainerV($)) {
            this.isOutSiblingsHorizontally = true;
            return true;
        }
        if (this.isOutThresholdH($)) {
            return true;
        }
        return false;
    };
    /**
     * Checks if dragged it out of its position or parent.
     *
     * @param siblingsK -
     */
    Draggable.prototype.isOutThreshold = function (siblingsK) {
        var _a = this.thresholds, siblings = _a.siblings, dragged = _a.dragged;
        return siblingsK
            ? this.isOutContainer(siblings[siblingsK])
            : this.isOutPosition(dragged);
    };
    /**
     * Checks if dragged is the first child and going up.
     */
    Draggable.prototype.isLeavingFromTop = function () {
        return (this.isFirstOrOutside() &&
            !this.isOutSiblingsHorizontally &&
            !this.isMovingDown);
    };
    /**
     * Checks if dragged is the last child and going down.
     */
    Draggable.prototype.isLeavingFromBottom = function () {
        var sK = DnDStore_1.default.getElmById(this.draggedElm.id).keys.sK;
        return (this.isLastELm() &&
            this.isMovingDown &&
            this.isOutContainerV(this.thresholds.siblings[sK]));
    };
    Draggable.prototype.isNotSettled = function () {
        var sK = DnDStore_1.default.getElmById(this.draggedElm.id).keys.sK;
        return (this.siblingsList !== null &&
            !this.isLeavingFromBottom() &&
            (this.isOutThreshold() || this.isOutThreshold(sK)));
    };
    /**
     * @param y -
     */
    Draggable.prototype.setDraggedMovingDown = function (y) {
        if (this.prevY === y)
            return;
        this.isMovingDown = y > this.prevY;
        this.prevY = y;
    };
    Draggable.prototype.incNumOfElementsTransformed = function (effectedElemDirection) {
        this.numberOfElementsTransformed += -1 * effectedElemDirection;
    };
    Draggable.prototype.hasMoved = function () {
        return (this.draggedElm.translateX !== this.tempTranslate.x ||
            this.draggedElm.translateY !== this.tempTranslate.y);
    };
    Draggable.prototype.setDraggedPosition = function (isFallback) {
        /**
         * In this case, the use clicked without making any move.
         */
        if (isFallback ||
            this.siblingsList === null ||
            this.numberOfElementsTransformed === 0
        // this.isNotSettled()
        ) {
            /**
             * If not isDraggedOutPosition, it means dragged is out its position, inside
             * list but didn't reach another element to replace.
             *
             * List's elements is in their position, just undo dragged.
             *
             * Restore dragged position (translateX, translateY) directly. Why? Because,
             * dragged depends on extra instance to float in layout that is not related to element
             * instance.
             */
            if (this.hasMoved()) {
                this.draggedElm.transformElm();
                if (this.siblingsList &&
                    this.siblingsList[this.draggedElm.order.self] !== this.draggedElm.id) {
                    this.draggedElm.assignNewPosition(this.siblingsList, this.draggedElm.order.self);
                }
            }
            return;
        }
        this.draggedElm.currentTop = this.occupiedOffset.currentTop;
        this.draggedElm.currentLeft = this.occupiedOffset.currentLeft;
        this.draggedElm.translateX = this.occupiedTranslate.translateX;
        this.draggedElm.translateY = this.occupiedTranslate.translateY;
        this.draggedElm.transformElm();
        if (this.siblingsList) {
            this.draggedElm.assignNewPosition(this.siblingsList, this.tempIndex);
        }
        this.draggedElm.order.self = this.tempIndex;
    };
    Draggable.prototype.endDragging = function (isFallback) {
        this.setDragged(false);
        this.setDraggedPosition(isFallback);
    };
    return Draggable;
}(Base_1.default));
exports.default = Draggable;
//# sourceMappingURL=Draggable.js.map

/***/ }),

/***/ "../../dist/Draggable/index.js":
/*!*************************************!*\
  !*** ../../dist/Draggable/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var Draggable_1 = __webpack_require__(/*! ./Draggable */ "../../dist/Draggable/Draggable.js");
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(Draggable_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../dist/Droppable/Droppable.js":
/*!*****************************************!*\
  !*** ../../dist/Droppable/Droppable.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var DnDStore_1 = __importDefault(__webpack_require__(/*! ../DnDStore */ "../../dist/DnDStore/index.js"));
/**
 * Class includes all transformation methods related to droppable.
 */
var Droppable = /** @class */ (function () {
    function Droppable(draggable) {
        this.draggable = draggable;
        this.elmTransitionY = 0;
        this.draggedAccumulatedTransitionY = 0;
        this.draggedYOffset = 0;
        this.leftDifference = 0;
        /**
         * Elements effected by dragged direction.
         */
        this.effectedElemDirection = 1;
        this.isListLocked = false;
        this.leftAtIndex = -1;
        this.updateLastElmOffset();
        this.siblingsEmptyElmIndex = -1;
    }
    /**
     * Gets the temporary index of dragged before it occupies new position.
     */
    Droppable.prototype.getDraggedTempIndex = function () {
        return this.draggable.tempIndex;
    };
    Droppable.prototype.setEffectedElemDirection = function (isUp) {
        this.effectedElemDirection = isUp ? -1 : 1;
    };
    Droppable.prototype.updateLastElmOffset = function () {
        var currentTop = 0;
        var currentLeft = 0;
        if (this.draggable.siblingsList) {
            var lastIndex = this.draggable.siblingsList.length - 1;
            var id = this.draggable.siblingsList[lastIndex];
            // TODO: What causes this? Need investigation.
            if (id) {
                var element = DnDStore_1.default.getElmById(id);
                if (element) {
                    if (element)
                        (currentTop = element.currentTop, currentLeft = element.currentLeft);
                }
            }
        }
        this.preserveLastElmOffset = {
            currentLeft: currentLeft,
            currentTop: currentTop,
        };
    };
    Droppable.prototype.updateOccupiedOffset = function (elmTop, elmLeft) {
        this.draggable.occupiedOffset.currentTop = elmTop + this.draggedYOffset;
        this.draggable.occupiedOffset.currentLeft = elmLeft;
    };
    Droppable.prototype.updateOccupiedTranslate = function (direction) {
        this.draggable.occupiedTranslate.translateY +=
            direction * this.draggedAccumulatedTransitionY;
        this.draggable.occupiedTranslate.translateX += 0;
    };
    Droppable.prototype.calculateYDistance = function (element) {
        var elmLeft = element.currentLeft, elmTop = element.currentTop, elmHight = element.offset.height;
        var _a = this.draggable, _b = _a.occupiedOffset, draggedLeft = _b.currentLeft, draggedTop = _b.currentTop, draggedHight = _a.draggedElm.offset.height;
        this.draggedYOffset = 0;
        this.elmTransitionY = 0;
        this.leftDifference = Math.abs(elmLeft - draggedLeft);
        var topDifference = Math.abs(elmTop - draggedTop);
        this.draggedAccumulatedTransitionY = topDifference;
        this.elmTransitionY = topDifference;
        var heightOffset = Math.abs(draggedHight - elmHight);
        if (heightOffset === 0)
            return;
        if (draggedHight < elmHight) {
            // console.log("elmHight is bigger");
            if (this.effectedElemDirection === -1) {
                // console.log("elm going up");
                this.draggedAccumulatedTransitionY += heightOffset;
                this.draggedYOffset = heightOffset;
            }
            else {
                // console.log("elm going down");
                this.elmTransitionY -= heightOffset;
            }
            return;
        }
        // console.log("elmHight is smaller");
        if (this.effectedElemDirection === -1) {
            // console.log("elm going up");
            this.draggedAccumulatedTransitionY -= heightOffset;
            this.draggedYOffset = -heightOffset;
        }
        else {
            // console.log("elm going down");
            this.elmTransitionY += heightOffset;
        }
    };
    /**
     * Updates element instance and calculates the required transform distance. It
     * invokes for each eligible element in the parent container.
     *
     * @param id -
     */
    Droppable.prototype.updateElement = function (id, isUpdateDraggedTranslate, draggedDirection) {
        var element = DnDStore_1.default.getElmById(id);
        this.calculateYDistance(element);
        this.draggable.incNumOfElementsTransformed(this.effectedElemDirection);
        // TODO: always true for the first element
        if (!this.isListLocked) {
            /**
             * By updating the dragged translate, we guarantee that dragged
             * transformation will not triggered until dragged is over threshold
             * which will be detected by isDraggedOutPosition.
             *
             * However, this is only effective when dragged is fit in its new
             * translate.
             *
             * And we have new translate only once. The first element matched the
             * condition is the breaking point element.
             */
            this.draggable.setThreshold(element.currentTop, element.currentLeft, element.offset.height);
        }
        // element.onDragOver();
        var elmLeft = element.currentLeft, elmTop = element.currentTop;
        this.updateOccupiedOffset(elmTop, elmLeft);
        if (isUpdateDraggedTranslate) {
            this.updateOccupiedTranslate(draggedDirection);
        }
        /**
         * Start transforming process
         */
        this.siblingsEmptyElmIndex = element.setYPosition(this.draggable.siblingsList, this.effectedElemDirection, this.elmTransitionY, this.draggable.operationID, this.siblingsEmptyElmIndex);
        // element.onDragLeave();
    };
    Droppable.prototype.isElemAboveDragged = function (elmCurrentOffsetTop) {
        return elmCurrentOffsetTop < this.draggable.tempOffset.currentTop;
    };
    Droppable.prototype.checkIfDraggedIsLastElm = function () {
        var isLast = false;
        for (var i = this.draggable.siblingsList.length - 1; i >= 0; i -= 1) {
            var id = this.draggable.siblingsList[i];
            if (this.isIDEligible2Move(id)) {
                var element = DnDStore_1.default.getElmById(id);
                var currentTop = element.currentTop;
                var isQualified = this.isElemAboveDragged(currentTop);
                if (isQualified) {
                    isLast = true;
                    /**
                     * Update threshold from here since there's no calling to updateElement.
                     */
                    this.draggable.setThreshold(this.preserveLastElmOffset.currentTop, this.preserveLastElmOffset.currentLeft, element.offset.height);
                    this.updateOccupiedOffset(this.preserveLastElmOffset.currentTop, this.preserveLastElmOffset.currentLeft);
                    break;
                }
                break;
            }
        }
        return isLast;
    };
    /**
     * Compares the dragged offset with element offset and returns
     * true if element is matched.
     *
     * @param elmCurrentOffsetTop -
     */
    Droppable.prototype.isElemUnderDragged = function (elmCurrentOffsetTop) {
        /**
         * Element is Switchable when it's under dragged.
         */
        return elmCurrentOffsetTop > this.draggable.tempOffset.currentTop;
    };
    Droppable.prototype.detectDroppableIndex = function () {
        var droppableIndex = null;
        for (var i = 0; i < this.draggable.siblingsList.length; i += 1) {
            var id = this.draggable.siblingsList[i];
            if (this.isIDEligible2Move(id)) {
                var element = DnDStore_1.default.getElmById(id);
                var currentTop = element.currentTop;
                var isQualified = this.isElemUnderDragged(currentTop);
                if (isQualified) {
                    droppableIndex = i;
                    break;
                }
            }
        }
        return droppableIndex;
    };
    /**
     *
     * @param id -
     */
    Droppable.prototype.isIDEligible2Move = function (id) {
        return id && id !== this.draggable.draggedElm.id;
    };
    Droppable.prototype.switchElement = function () {
        var elmIndex = this.draggable.tempIndex + -1 * this.effectedElemDirection;
        var id = this.draggable.siblingsList[elmIndex];
        if (this.isIDEligible2Move(id)) {
            this.draggable.tempIndex = elmIndex;
            this.updateElement(id, true, this.effectedElemDirection === -1 ? 1 : -1);
        }
    };
    Droppable.prototype.liftUp = function () {
        var from = this.draggable.tempIndex + 1;
        this.leftAtIndex = this.draggable.tempIndex;
        this.draggable.tempIndex = -1;
        for (var i = from; i < this.draggable.siblingsList.length; i += 1) {
            /**
             * Don't update translate because it's not permanent. Releasing dragged
             * means undoing last position.
             */
            var id = this.draggable.siblingsList[i];
            if (this.isIDEligible2Move(id)) {
                this.updateElement(id, true, 1);
            }
        }
    };
    /**
     *
     * @param to - index
     */
    Droppable.prototype.moveDown = function (to) {
        for (var i = this.draggable.siblingsList.length - 1; i >= to; i -= 1) {
            var id = this.draggable.siblingsList[i];
            if (this.isIDEligible2Move(id)) {
                this.updateElement(id, true, -1);
            }
        }
    };
    Droppable.prototype.draggedOutPosition = function () {
        if (this.draggable.isLeavingFromTop()) {
            /**
             * If leaving and parent locked, do nothing.
             */
            // move element up
            this.setEffectedElemDirection(true);
            // lock the parent
            this.isListLocked = true;
            this.liftUp();
            return;
        }
        if (this.draggable.isLeavingFromBottom()) {
            this.isListLocked = true;
            return;
        }
        if (!this.isListLocked) {
            /**
             * normal movement inside the parent
             */
            /**
             * Going out from the list: Right/left.
             */
            if (this.draggable.isOutPositionHorizontally) {
                // Is is out parent?
                // move element up
                this.setEffectedElemDirection(true);
                // lock the parent
                this.isListLocked = true;
                this.liftUp();
                return;
            }
            /**
             * Normal state, switch.
             */
            // inside the list, effected should be related to mouse movement
            this.setEffectedElemDirection(this.draggable.isMovingDown);
            this.switchElement();
        }
    };
    Droppable.prototype.unlockParent = function () {
        this.isListLocked = false;
    };
    /**
     *
     * @param y -
     */
    Droppable.prototype.draggedIsComingIn = function (y) {
        /**
         * If tempIndex is zero, the dragged is coming from the top. So, move them
         * down all: to=0
         */
        var to = 0;
        var hasToMoveSiblingsDown = true;
        /**
         * Otherwise, detect where it coming from and update tempIndex
         * accordingly.
         */
        if (this.draggable.tempIndex !== 0) {
            to = this.detectDroppableIndex();
            if (typeof to !== "number") {
                // check if it's the last element
                if (!this.checkIfDraggedIsLastElm())
                    return;
                to = this.draggable.siblingsList.length - 1;
                hasToMoveSiblingsDown = false;
            }
            this.draggable.tempIndex = to;
            /**
             * Last prevY update when leaving the parent container. When we have
             * coming element inside we need new value so we can assign isMoveDown
             * correctly.
             */
            this.draggable.prevY = y;
        }
        this.unlockParent();
        /**
         * Moving element down by setting is up to false
         */
        this.setEffectedElemDirection(false);
        if (hasToMoveSiblingsDown) {
            this.moveDown(to);
            /**
             * Now, resitting direction by figuring out if dragged settled up/dwn.
             */
            var isElmUp = this.leftAtIndex > this.draggable.tempIndex;
            this.setEffectedElemDirection(isElmUp);
        }
        else {
            this.setEffectedElemDirection(true);
        }
        // Prevent elements collision. Add only if empty.
        if (this.draggable.siblingsList[to].length === 0) {
            this.draggable.siblingsList[to] = this.draggable.draggedElm.id;
        }
        else if (true) {
            // eslint-disable-next-line no-console
            console.error("Illegal Attempt: dragged is positioned above the existing element in the index " + to, this.draggable.siblingsList);
        }
        /**
         * Reset index.
         */
        this.leftAtIndex = -1;
    };
    /**
     * Invokes draggable method responsible of transform.
     * Monitors dragged translate and called related methods. Which controls the
     * active and droppable method.
     *
     * @param x- mouse X coordinate
     * @param y- mouse Y coordinate
     */
    Droppable.prototype.dragAt = function (x, y) {
        this.draggable.dragAt(x, y);
        if (this.draggable.siblingsList === null)
            return;
        var isOutSiblingsContainer = false;
        var sK = DnDStore_1.default.getElmById(this.draggable.draggedElm.id).keys.sK;
        this.draggable.setDraggedMovingDown(y);
        if (this.draggable.isOutThreshold()) {
            if (!this.isListLocked) {
                this.draggedOutPosition();
                return;
            }
            isOutSiblingsContainer = this.draggable.isOutThreshold(sK);
            // // when it's out, and on of theses is true then it's happening.
            if (!isOutSiblingsContainer) {
                this.draggedIsComingIn(y);
                return;
            }
            return;
        }
        /**
         * When dragged is out parent and returning to it.
         */
        if (this.isListLocked) {
            isOutSiblingsContainer = this.draggable.isOutThreshold(sK);
            if (!isOutSiblingsContainer) {
                this.draggedIsComingIn(y);
            }
        }
    };
    return Droppable;
}());
exports.default = Droppable;
//# sourceMappingURL=Droppable.js.map

/***/ }),

/***/ "../../dist/Droppable/EndDroppable.js":
/*!********************************************!*\
  !*** ../../dist/Droppable/EndDroppable.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var DnDStore_1 = __importDefault(__webpack_require__(/*! ../DnDStore */ "../../dist/DnDStore/index.js"));
var Droppable_1 = __importDefault(__webpack_require__(/*! ./Droppable */ "../../dist/Droppable/Droppable.js"));
var EndDroppable = /** @class */ (function (_super) {
    __extends(EndDroppable, _super);
    function EndDroppable(draggable) {
        var _this = _super.call(this, draggable) || this;
        _this.spliceAt = -1;
        return _this;
    }
    /**
     *
     * @param lst -
     * @param i -
     */
    EndDroppable.prototype.undoElmTranslate = function (lst, i) {
        var elmID = lst[i];
        if (elmID) {
            var element = DnDStore_1.default.getElmById(elmID);
            /**
             * Note: rolling back won't affect order array. It only deals with element
             * itself and totally ignore any instance related to store.
             */
            element.rollYBack(this.draggable.operationID);
            this.draggable.numberOfElementsTransformed -= 1;
        }
        else {
            this.spliceAt = i;
        }
    };
    EndDroppable.prototype.loopAscWithAnimationFrame = function (from, lst) {
        var _this = this;
        var i = from;
        var run = function () {
            _this.undoElmTranslate(lst, i);
            i += 1;
            if (i < lst.length) {
                requestAnimationFrame(run);
            }
        };
        requestAnimationFrame(run);
    };
    EndDroppable.prototype.loopDesWithAnimationFrame = function (from, lst) {
        var _this = this;
        var i = from;
        var run = function () {
            _this.undoElmTranslate(lst, i);
            i -= 1;
            if (i >= 0) {
                requestAnimationFrame(run);
            }
        };
        requestAnimationFrame(run);
    };
    /**
     * Undo list elements order and instances including translateX/Y and indexes
     * locally.
     */
    EndDroppable.prototype.undoList = function (lst) {
        var _a = this.draggable.draggedElm, from = _a.order.self, draggedID = _a.id;
        if (this.isListLocked || this.draggable.isMovingDown) {
            this.loopAscWithAnimationFrame(from, lst);
        }
        else {
            /**
             * If from is zero, means dragged left, and all siblings are lifted up.
             */
            var actualFrom = from === 0 ? lst.length - 1 : from;
            this.loopDesWithAnimationFrame(actualFrom, lst);
        }
        lst.splice(this.spliceAt, 1);
        lst.splice(from, 0, draggedID);
    };
    EndDroppable.prototype.verify = function (lst) {
        var siblingsBoundaries = DnDStore_1.default.siblingsBoundaries[DnDStore_1.default.registry[this.draggable.draggedElm.id].keys.sK];
        var id = lst[0];
        if (id.length === 0 || this.draggable.draggedElm.id === id) {
            return (Math.floor(siblingsBoundaries.top) ===
                Math.floor(this.draggable.occupiedOffset.currentTop));
        }
        var element = DnDStore_1.default.getElmById(id);
        return (Math.floor(siblingsBoundaries.top) === Math.floor(element.currentTop));
    };
    EndDroppable.prototype.endDragging = function () {
        var siblings = DnDStore_1.default.getElmSiblingsById(this.draggable.draggedElm.id);
        var isFallback = false;
        if (Array.isArray(siblings)) {
            if (this.draggable.isNotSettled() || !this.verify(siblings)) {
                isFallback = true;
                this.undoList(siblings);
            }
        }
        this.draggable.endDragging(isFallback);
    };
    return EndDroppable;
}(Droppable_1.default));
exports.default = EndDroppable;
//# sourceMappingURL=EndDroppable.js.map

/***/ }),

/***/ "../../dist/Droppable/index.js":
/*!*************************************!*\
  !*** ../../dist/Droppable/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var EndDroppable_1 = __webpack_require__(/*! ./EndDroppable */ "../../dist/Droppable/EndDroppable.js");
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(EndDroppable_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../dist/index.js":
/*!***************************!*\
  !*** ../../dist/index.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DnD = exports.store = void 0;
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var DnDStore_1 = __webpack_require__(/*! ./DnDStore */ "../../dist/DnDStore/index.js");
Object.defineProperty(exports, "store", ({ enumerable: true, get: function () { return __importDefault(DnDStore_1).default; } }));
var DnD_1 = __webpack_require__(/*! ./DnD */ "../../dist/DnD.js");
Object.defineProperty(exports, "DnD", ({ enumerable: true, get: function () { return __importDefault(DnD_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../dom-gen/dist/Generator.js":
/*!******************************************!*\
  !*** ../../../dom-gen/dist/Generator.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __importDefault(__webpack_require__(/*! ./utils */ "../../../dom-gen/dist/utils.js"));
/**
 * Generate keys to connect relations between DOM-elements depending on tree
 * depth.
 */
var Generator = /** @class */ (function () {
    function Generator() {
        this.indicator = {};
        this.branches = {};
        this.prevDepth = -99;
        this.prevKey = utils_1.default(0, 0);
    }
    /**
     * Initiates self and parent indicators if not.
     *
     * @param dp - element depth
     */
    Generator.prototype.initIndicators = function (dp) {
        /**
         * initiate self from -1 since self is incremented after the id is added so
         * it's children won't be confused about their parent indicator.
         *
         * if start from /dp = 1/
         * - this.indicator[1] = -1
         * - element added
         * -  this.indicator[1] + 1
         * Now, If we get /dp = 0/
         * - this.indicator[dp+1] = 0 which is what we want.
         *
         * By adding this, we can deal with parents coming first before children.
         */
        if (this.indicator[dp] === undefined) {
            this.indicator[dp] = -1;
        }
        /**
         * initiate parents from zero.
         * this.indicator[dp+1] = 0
         */
        if (this.indicator[dp + 1] === undefined) {
            this.indicator[dp + 1] = 0;
        }
        if (this.indicator[dp + 2] === undefined) {
            this.indicator[dp + 2] = 0;
        }
    };
    /**
     *  Checks if element has no siblings in the branch
     *
     * @param  sk - Siblings Key- siblings key
     */
    Generator.prototype.isElmSingleton = function (sK) {
        return this.branches[sK].constructor !== Array;
    };
    /**
     * Adds elements to its siblings.
     *
     * @param id - element id
     * @param  sk - Siblings Key- siblings key
     */
    Generator.prototype.addToSiblings = function (id, sK) {
        var selfIndex = 0;
        /**
         * Don't create array for only one child.
         */
        if (this.branches[sK] === undefined) {
            this.branches[sK] = id;
        }
        else {
            /**
             * So here we have multiple children, we better create an array now.
             */
            if (this.isElmSingleton(sK)) {
                var prevId = this.branches[sK];
                this.branches[sK] = [];
                // @ts-ignore
                this.branches[sK].push(prevId);
            }
            // @ts-ignore
            selfIndex = this.branches[sK].push(id) - 1;
        }
        return selfIndex;
    };
    /**
     * Gets all element IDs Siblings in given node represented by sk.
     *
     * @param  sk - Siblings Key
     */
    Generator.prototype.getElmBranch = function (sk) {
        return this.branches[sk];
    };
    /**
     * Sets new branch for given key.
     *
     * @param  sk - Siblings Key- sibling key
     * @param branch - new branch
     */
    Generator.prototype.setElmBranch = function (sK, branch) {
        this.branches[sK] = branch;
    };
    /**
     * Main method.
     *
     * Add element to branches.
     *
     * @param id - element id
     * @param depth - element depth
     */
    Generator.prototype.getElmPointer = function (id, depth) {
        if (depth !== this.prevDepth) {
            this.initIndicators(depth);
        }
        /**
         * Get parent index.
         */
        var parentIndex = this.indicator[depth + 1];
        /**
         * get siblings unique key (sK) and parents key (pK)
         */
        var siblingsKey = utils_1.default(depth, parentIndex);
        var parentKey = utils_1.default(depth + 1, this.indicator[depth + 2]);
        var selfIndex = this.addToSiblings(id, siblingsKey);
        if (depth < this.prevDepth) {
            /**
             * Start new branch.
             */
            this.indicator[0] = 0;
        }
        this.prevDepth = depth;
        var childrenKey = this.prevKey;
        this.prevKey = siblingsKey;
        this.indicator[depth] += 1;
        var keys = {
            sK: siblingsKey,
            pK: parentKey,
            chK: depth === 0 ? null : childrenKey,
        };
        var order = {
            self: selfIndex,
            parent: parentIndex,
        };
        return { order: order, keys: keys };
    };
    return Generator;
}());
exports.default = Generator;
//# sourceMappingURL=Generator.js.map

/***/ }),

/***/ "../../../dom-gen/dist/index.js":
/*!**************************************!*\
  !*** ../../../dom-gen/dist/index.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var Generator_1 = __webpack_require__(/*! ./Generator */ "../../../dom-gen/dist/Generator.js");
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(Generator_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../dom-gen/dist/utils.js":
/*!**************************************!*\
  !*** ../../../dom-gen/dist/utils.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
function genKey(dp, i) {
    return dp + "-" + i;
}
exports.default = genKey;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ "../../../draggable/dist/AbstractDraggable.js":
/*!****************************************************!*\
  !*** ../../../draggable/dist/AbstractDraggable.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var draggedStyleProps = [
    {
        prop: "position",
        dragValue: "relative",
        afterDragValue: null,
    },
    {
        prop: "zIndex",
        dragValue: "99",
        afterDragValue: null,
    },
    {
        prop: "user-select",
        dragValue: "none",
        afterDragValue: null,
    },
];
var AbstractDraggable = /** @class */ (function () {
    /**
     * Creates an instance of AbstractDraggable.
     * Works Only on dragged element level.
     *
     * @param abstractCoreElm -
     * @param initCoordinates -
     */
    function AbstractDraggable(abstractCoreElm, _a) {
        /**
         * Assign instance for dragged.
         */
        var initX = _a.x, initY = _a.y;
        this.draggedElm = abstractCoreElm;
        var _b = this.draggedElm, translateX = _b.translateX, translateY = _b.translateY, draggedStyle = _b.ref.style;
        this.draggedStyleRef = draggedStyle;
        this.outerOffsetX = -initX + translateX;
        this.outerOffsetY = -initY + translateY;
        this.tempTranslate = {
            x: 0,
            y: 0,
        };
        this.draggedStyle = draggedStyleProps;
        this.setDragged(true);
    }
    /**
     * Triggers twice. Once when constructor is initiated, the other when drag is
     * ended. It adds/removes style.
     *
     * @param isActive - is dragged operation active or it is ended.
     */
    AbstractDraggable.prototype.setDragged = function (isActive) {
        var _this = this;
        var _a;
        if (isActive) {
            this.draggedStyle.forEach(function (_a) {
                var prop = _a.prop, dragValue = _a.dragValue;
                // @ts-expect-error
                _this.draggedStyleRef[prop] = dragValue;
            });
            (_a = getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            return;
        }
        /**
         * Not active: end of dragging.
         */
        this.draggedStyle.forEach(function (_a) {
            var prop = _a.prop, afterDragValue = _a.afterDragValue;
            // @ts-ignore
            _this.draggedStyleRef[prop] = afterDragValue;
        });
    };
    /**
     * Executes dragging by applying transform.
     * Writes to draggedElmCurrentOffset in Transform class.
     * Set values to isDragged flags.
     *
     * @param x - mouse x coordinates
     * @param y - mouse y coordinates
     */
    AbstractDraggable.prototype.translate = function (x, y) {
        /**
         * Calculates translate coordinates.
         *
         * Indicates dragged y-transformation that's will be updated during the
         * dropping process. Updating Y immediately will effect calculations in
         * transform, that's why it is updated when dragging is done.
         */
        this.tempTranslate.x = x + this.outerOffsetX;
        this.tempTranslate.y = y + this.outerOffsetY;
        this.draggedStyleRef.transform = "translate3d(" + this.tempTranslate.x + "px," + this.tempTranslate.y + "px, 0)";
    };
    return AbstractDraggable;
}());
exports.default = AbstractDraggable;
//# sourceMappingURL=AbstractDraggable.js.map

/***/ }),

/***/ "../../../draggable/dist/Draggable.js":
/*!********************************************!*\
  !*** ../../../draggable/dist/Draggable.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var DraggableStoreImp_1 = __importDefault(__webpack_require__(/*! ./DraggableStoreImp */ "../../../draggable/dist/DraggableStoreImp.js"));
var AbstractDraggable_1 = __importDefault(__webpack_require__(/*! ./AbstractDraggable */ "../../../draggable/dist/AbstractDraggable.js"));
var Draggable = /** @class */ (function (_super) {
    __extends(Draggable, _super);
    /**
     * Creates an instance of Draggable.
     * Works Only on dragged element level.
     *
     *
     * @param id - elementId
     * @param clickCoordinates -
     */
    function Draggable(id, clickCoordinates) {
        var _this = this;
        var element = DraggableStoreImp_1.default.getElmById(id);
        _this = _super.call(this, element, clickCoordinates) || this;
        return _this;
    }
    /**
     * @param x -
     * @param y -
     */
    Draggable.prototype.dragAt = function (x, y) {
        this.translate(x, y);
        this.draggedElm.translateX = this.tempTranslate.x;
        this.draggedElm.translateY = this.tempTranslate.y;
    };
    Draggable.prototype.endDragging = function () {
        this.setDragged(false);
    };
    return Draggable;
}(AbstractDraggable_1.default));
exports.default = Draggable;
//# sourceMappingURL=Draggable.js.map

/***/ }),

/***/ "../../../draggable/dist/DraggableStoreImp.js":
/*!****************************************************!*\
  !*** ../../../draggable/dist/DraggableStoreImp.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var store_1 = __importDefault(__webpack_require__(/*! @dflex/store */ "../../../store/dist/index.js"));
var core_instance_1 = __importDefault(__webpack_require__(/*! @dflex/core-instance */ "../../../core-instance/dist/index.js"));
var DraggableStoreImp = /** @class */ (function (_super) {
    __extends(DraggableStoreImp, _super);
    function DraggableStoreImp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Register element for Draggable store
     *
     * @param element -
     */
    DraggableStoreImp.prototype.register = function (element) {
        _super.prototype.register.call(this, element, core_instance_1.default);
    };
    return DraggableStoreImp;
}(store_1.default));
exports.default = (function createStoreInstance() {
    var store = new DraggableStoreImp();
    return store;
})();
//# sourceMappingURL=DraggableStoreImp.js.map

/***/ }),

/***/ "../../../draggable/dist/index.js":
/*!****************************************!*\
  !*** ../../../draggable/dist/index.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractDraggable = exports.store = exports.Draggable = void 0;
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Draggable_1 = __webpack_require__(/*! ./Draggable */ "../../../draggable/dist/Draggable.js");
Object.defineProperty(exports, "Draggable", ({ enumerable: true, get: function () { return __importDefault(Draggable_1).default; } }));
var DraggableStoreImp_1 = __webpack_require__(/*! ./DraggableStoreImp */ "../../../draggable/dist/DraggableStoreImp.js");
Object.defineProperty(exports, "store", ({ enumerable: true, get: function () { return __importDefault(DraggableStoreImp_1).default; } }));
var AbstractDraggable_1 = __webpack_require__(/*! ./AbstractDraggable */ "../../../draggable/dist/AbstractDraggable.js");
Object.defineProperty(exports, "AbstractDraggable", ({ enumerable: true, get: function () { return __importDefault(AbstractDraggable_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../store/dist/Store.js":
/*!************************************!*\
  !*** ../../../store/dist/Store.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Copyright (c) Jalal Maskoun.
 *
 * This source code is licensed under the AGPL3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
var dom_gen_1 = __importDefault(__webpack_require__(/*! @dflex/dom-gen */ "../../../dom-gen/dist/index.js"));
var Store = /** @class */ (function () {
    function Store() {
        this.registry = {};
        this.DOMGen = new dom_gen_1.default();
    }
    /**
     * Delete element from the registry. Should be called only when element is
     * unmounted and expected to return with different positions only.
     *
     * @param id -
     */
    Store.prototype.deleteElm = function (id) {
        var _a = this.registry, _b = id, oldRecord = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
        this.registry = rest;
    };
    /**
     * Mutate elmInstance into CustomInstance then add the new object to registry
     * by id.
     *
     * @param element -
     * @param CustomInstance -
     */
    Store.prototype.register = function (element, CustomInstance, opts) {
        var idElm = element.id, _a = element.depth, depth = _a === void 0 ? 0 : _a, ref = element.ref;
        if (!ref || ref.nodeType !== Node.ELEMENT_NODE) {
            throw new Error("DFlex: Invalid HTMLElement: " + ref + " is passed to registry");
        }
        if (!idElm && !ref.id) {
            throw new Error("DFlex: A valid and unique id is required.");
        }
        var id = idElm || ref.id;
        var _b = this.DOMGen.getElmPointer(id, depth), order = _b.order, keys = _b.keys;
        var coreElement = { id: id, depth: depth, ref: ref, order: order, keys: keys };
        // TODO: fix TS error here.
        // @ts-ignore
        this.registry[id] =
            CustomInstance && typeof CustomInstance.constructor === "function"
                ? new CustomInstance(coreElement, opts)
                : coreElement;
    };
    /**
     * Gets element from registry by Id.
     *
     * @param id -
     */
    Store.prototype.getElmById = function (id) {
        return this.registry[id];
    };
    /**
     * Gets all element IDs Siblings in given node represented by sibling key.
     *
     * @param siblingsKy -
     */
    Store.prototype.getElmBranchByKey = function (siblingsKy) {
        return this.DOMGen.getElmBranch(siblingsKy);
    };
    return Store;
}());
exports.default = Store;
//# sourceMappingURL=Store.js.map

/***/ }),

/***/ "../../../store/dist/index.js":
/*!************************************!*\
  !*** ../../../store/dist/index.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = void 0;
var Store_1 = __webpack_require__(/*! ./Store */ "../../../store/dist/Store.js");
Object.defineProperty(exports, "default", ({ enumerable: true, get: function () { return __importDefault(Store_1).default; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-dev-runtime");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__("./pages/extended.tsx"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi9wYWdlcy9leHRlbmRlZC50c3giLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4vc3JjL0RuRENvbXBvbmVudC50c3giLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4vc3JjL2V4dGVuZGVkL0V4dGVuZGVkTGlzdC50c3giLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4vc3JjL2V4dGVuZGVkL2luZGV4LnRzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uL3NyYy9EZW1vLm1vZHVsZS5jc3MiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uLy4uL2NvcmUtaW5zdGFuY2UvZGlzdC9BYnN0cmFjdENvcmVJbnN0YW5jZS5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vLi4vY29yZS1pbnN0YW5jZS9kaXN0L0NvcmVJbnN0YW5jZS5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vLi4vY29yZS1pbnN0YW5jZS9kaXN0L2luZGV4LmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi9kaXN0L0RuRC5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vZGlzdC9EbkRTdG9yZS9EbkRTdG9yZUltcC5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vZGlzdC9EbkRTdG9yZS9UcmFja2VyLmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi9kaXN0L0RuRFN0b3JlL2luZGV4LmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi9kaXN0L0RyYWdnYWJsZS9CYXNlLmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi9kaXN0L0RyYWdnYWJsZS9EcmFnZ2FibGUuanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uL2Rpc3QvRHJhZ2dhYmxlL2luZGV4LmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi9kaXN0L0Ryb3BwYWJsZS9Ecm9wcGFibGUuanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uL2Rpc3QvRHJvcHBhYmxlL0VuZERyb3BwYWJsZS5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vZGlzdC9Ecm9wcGFibGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uLy4uL2RvbS1nZW4vZGlzdC9HZW5lcmF0b3IuanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uLy4uL2RvbS1nZW4vZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vLi4vZG9tLWdlbi9kaXN0L3V0aWxzLmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi8uLi9kcmFnZ2FibGUvZGlzdC9BYnN0cmFjdERyYWdnYWJsZS5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vLi4vZHJhZ2dhYmxlL2Rpc3QvRHJhZ2dhYmxlLmpzIiwid2VicGFjazovL2RmbGV4LXJlYWN0LWRuZC8uLi8uLi8uLi9kcmFnZ2FibGUvZGlzdC9EcmFnZ2FibGVTdG9yZUltcC5qcyIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvLi4vLi4vLi4vZHJhZ2dhYmxlL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uLy4uL3N0b3JlL2Rpc3QvU3RvcmUuanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kLy4uLy4uLy4uL3N0b3JlL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZGZsZXgtcmVhY3QtZG5kL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly9kZmxleC1yZWFjdC1kbmQvZXh0ZXJuYWwgXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIiJdLCJuYW1lcyI6WyJFeHRlbmRlZExpc3QiLCJkbmRFdmVudCIsIlRvZG9JdGVtIiwiQ29tcG9uZW50IiwiaWQiLCJzdHlsZSIsImNsYXNzTmFtZSIsImNoaWxkcmVuIiwiZGVwdGgiLCJ0YXNrUmVmIiwiUmVhY3QiLCJzdG9yZSIsInJlZiIsImN1cnJlbnQiLCJvbk1vdXNlTW92ZSIsImUiLCJjbGllbnRYIiwiY2xpZW50WSIsImRyYWdBdCIsIm9uTW91c2VVcCIsImVuZERyYWdnaW5nIiwiZG9jdW1lbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib25Nb3VzZURvd24iLCJidXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwiRG5EIiwieCIsInkiLCJvblRvdWNoTW92ZSIsInRvdWNoZXMiLCJvblRvdWNoRW5kIiwib25Ub3VjaFN0YXJ0IiwidGFza3MiLCJpIiwidW5pIiwicHVzaCIsImtleSIsInRhc2siLCJzIiwibWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUVBLCtEQUFlQSxrREFBZixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtDQUlBOztBQUNBLElBQUlDLFFBQUo7QUFXTyxNQUFNQyxRQUFRLEdBQUcsQ0FBQztBQUN2QkMsV0FBUyxHQUFHLElBRFc7QUFFdkJDLElBRnVCO0FBR3ZCQyxPQUh1QjtBQUl2QkMsV0FKdUI7QUFLdkJDLFVBTHVCO0FBTXZCQyxPQUFLLEdBQUc7QUFOZSxDQUFELEtBT1g7QUFDWCxRQUFNQyxPQUFPLEdBQUdDLG1EQUFBLEVBQWhCO0FBRUFBLHdEQUFBLENBQWdCLE1BQU07QUFDcEJDLDBEQUFBLENBQWU7QUFBRVAsUUFBRjtBQUFNUSxTQUFHLEVBQUVILE9BQU8sQ0FBQ0ksT0FBbkI7QUFBNkJMO0FBQTdCLEtBQWY7QUFDRCxHQUZELEVBRUcsRUFGSDs7QUFJQSxRQUFNTSxX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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQSw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsaUNBQWlDLG1CQUFPLENBQUMsaURBQWE7QUFDdEQsNkJBQTZCLG1CQUFPLENBQUMsNENBQVE7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWU7QUFDZixxQzs7Ozs7Ozs7Ozs7QUN2UmE7QUFDYjtBQUNBLDRDQUE0QztBQUM1QztBQUNBLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RCxlQUFlO0FBQ2Ysa0JBQWtCLG1CQUFPLENBQUMsc0RBQWE7QUFDdkMsMkNBQTBDLENBQUMscUNBQXFDLDZDQUE2QyxFQUFFLEVBQUUsRUFBQztBQUNsSSxpQzs7Ozs7Ozs7Ozs7QUNSYTtBQUNiO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0EsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdELGlDQUFpQyxtQkFBTyxDQUFDLGlEQUFhO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCxRQUFRO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix3Q0FBd0M7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQix3Q0FBd0M7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNERBQTRELFNBQVM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixJQUFxQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxlQUFlO0FBQ2YsaUM7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2I7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQSw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsZUFBZTtBQUNmLGNBQWMsbUJBQU8sQ0FBQyw2Q0FBUztBQUMvQiwyQ0FBMEMsQ0FBQyxxQ0FBcUMseUNBQXlDLEVBQUUsRUFBRSxFQUFDO0FBQzlILGlDOzs7Ozs7Ozs7OztBQ1JBLG1DOzs7Ozs7Ozs7OztBQ0FBLG1EIiwiZmlsZSI6InBhZ2VzL2V4dGVuZGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXHJcbmltcG9ydCBFeHRlbmRlZExpc3QgZnJvbSBcIi4uL3NyYy9leHRlbmRlZFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRXh0ZW5kZWRMaXN0O1xyXG4iLCIvKipcclxuICogQ29weXJpZ2h0IChjKSBKYWxhbCBNYXNrb3VuLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBBR1BMMy4wIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cclxuXHJcbmltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuXHJcbmltcG9ydCB7IHN0b3JlLCBEbkQgfSBmcm9tIFwiQGRmbGV4L2RuZFwiO1xyXG5cclxuLy8gc2hhcmVkIGRyYWdnZWQgZXZlbnRcclxubGV0IGRuZEV2ZW50OiBEbkQgfCBudWxsO1xyXG5cclxuaW50ZXJmYWNlIFByb3BzIHtcclxuICBDb21wb25lbnQ/OiBzdHJpbmcgfCBSZWFjdC5KU1hFbGVtZW50Q29uc3RydWN0b3I8YW55PjtcclxuICBpZDogc3RyaW5nO1xyXG4gIHN0eWxlPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcclxuICBjbGFzc05hbWU/OiBzdHJpbmc7XHJcbiAgZGVwdGg/OiBudW1iZXI7XHJcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFRvZG9JdGVtID0gKHtcclxuICBDb21wb25lbnQgPSBcImxpXCIsXHJcbiAgaWQsXHJcbiAgc3R5bGUsXHJcbiAgY2xhc3NOYW1lLFxyXG4gIGNoaWxkcmVuLFxyXG4gIGRlcHRoID0gMCxcclxufTogUHJvcHMpID0+IHtcclxuICBjb25zdCB0YXNrUmVmID0gUmVhY3QudXNlUmVmKCkgYXMgUmVhY3QuTXV0YWJsZVJlZk9iamVjdDxIVE1MTElFbGVtZW50PjtcclxuXHJcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHN0b3JlLnJlZ2lzdGVyKHsgaWQsIHJlZjogdGFza1JlZi5jdXJyZW50ISwgZGVwdGggfSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBvbk1vdXNlTW92ZSA9IChlOiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAvLyBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgIGlmIChkbmRFdmVudCkge1xyXG4gICAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IGU7XHJcblxyXG4gICAgICBkbmRFdmVudC5kcmFnQXQoY2xpZW50WCwgY2xpZW50WSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Nb3VzZVVwID0gKCkgPT4ge1xyXG4gICAgaWYgKGRuZEV2ZW50KSB7XHJcbiAgICAgIGRuZEV2ZW50LmVuZERyYWdnaW5nKCk7XHJcblxyXG4gICAgICBkbmRFdmVudCA9IG51bGw7XHJcblxyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBvbk1vdXNlVXApO1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbk1vdXNlRG93biA9IChlOiBSZWFjdC5Nb3VzZUV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IGJ1dHRvbiwgY2xpZW50WCwgY2xpZW50WSB9ID0gZTtcclxuXHJcbiAgICAvLyBBdm9pZCByaWdodCBtb3VzZSBjbGljayBhbmQgZW5zdXJlIGlkXHJcbiAgICBpZiAodHlwZW9mIGJ1dHRvbiA9PT0gXCJudW1iZXJcIiAmJiBidXR0b24gPT09IDApIHtcclxuICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgb25Nb3VzZVVwKTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcclxuICAgICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIG9uTW91c2VTY3JvbGwpO1xyXG5cclxuICAgICAgICBkbmRFdmVudCA9IG5ldyBEbkQoaWQsIHsgeDogY2xpZW50WCwgeTogY2xpZW50WSB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uVG91Y2hNb3ZlID0gKGU6IFRvdWNoRXZlbnQpID0+IHtcclxuICAgIGlmIChkbmRFdmVudCkge1xyXG4gICAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IGUudG91Y2hlc1swXTtcclxuXHJcbiAgICAgIGRuZEV2ZW50LmRyYWdBdChjbGllbnRYLCBjbGllbnRZKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvblRvdWNoRW5kID0gKCkgPT4ge1xyXG4gICAgaWYgKGRuZEV2ZW50KSB7XHJcbiAgICAgIGRuZEV2ZW50LmVuZERyYWdnaW5nKCk7XHJcblxyXG4gICAgICBkbmRFdmVudCA9IG51bGw7XHJcblxyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgb25Ub3VjaEVuZCk7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgb25Ub3VjaE1vdmUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uVG91Y2hTdGFydCA9IChlOiBSZWFjdC5Ub3VjaEV2ZW50KSA9PiB7XHJcbiAgICBjb25zdCB7IGNsaWVudFgsIGNsaWVudFkgfSA9IGUudG91Y2hlc1swXTtcclxuXHJcbiAgICBpZiAoaWQpIHtcclxuICAgICAgZG5kRXZlbnQgPSBuZXcgRG5EKGlkLCB7IHg6IGNsaWVudFgsIHk6IGNsaWVudFkgfSk7XHJcblxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgb25Ub3VjaEVuZCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgb25Ub3VjaE1vdmUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Q29tcG9uZW50XHJcbiAgICAgIHJlZj17dGFza1JlZn1cclxuICAgICAgaWQ9e2lkfVxyXG4gICAgICBvblRvdWNoU3RhcnQ9e29uVG91Y2hTdGFydH1cclxuICAgICAgb25Nb3VzZURvd249e29uTW91c2VEb3dufVxyXG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cclxuICAgICAgc3R5bGU9e3N0eWxlfVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0NvbXBvbmVudD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVG9kb0l0ZW07XHJcbiIsIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIEphbGFsIE1hc2tvdW4uXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEFHUEwzLjAgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxuXHJcbi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLWFycmF5LWluZGV4LWtleSAqL1xyXG5pbXBvcnQgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBzIGZyb20gXCIuLi9EZW1vLm1vZHVsZS5jc3NcIjtcclxuXHJcbmltcG9ydCBEbkRDb21wb25lbnQgZnJvbSBcIi4uL0RuRENvbXBvbmVudFwiO1xyXG5cclxuY29uc3QgRXh0ZW5kZWRMaXN0ID0gKCkgPT4ge1xyXG4gIGNvbnN0IHRhc2tzID0gW107XHJcblxyXG4gIGZvciAobGV0IGkgPSAxOyBpIDw9IDEwMDA7IGkgKz0gMSkge1xyXG4gICAgY29uc3QgdW5pID0gYCR7aX0tZXh0ZW5kZWRgO1xyXG5cclxuICAgIHRhc2tzLnB1c2goeyBpZDogdW5pLCBrZXk6IHVuaSwgdGFzazogYCR7aX1gIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPXtzLnJvb3R9PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17cy50b2RvfT5cclxuICAgICAgICA8dWw+XHJcbiAgICAgICAgICB7dGFza3MubWFwKCh7IHRhc2ssIGlkLCBrZXkgfSkgPT4gKFxyXG4gICAgICAgICAgICA8RG5EQ29tcG9uZW50IGlkPXtpZH0ga2V5PXtrZXl9PlxyXG4gICAgICAgICAgICAgIHt0YXNrfVxyXG4gICAgICAgICAgICA8L0RuRENvbXBvbmVudD5cclxuICAgICAgICAgICkpfVxyXG4gICAgICAgIDwvdWw+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEV4dGVuZGVkTGlzdDtcclxuIiwiLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5cclxuZXhwb3J0IHsgZGVmYXVsdCB9IGZyb20gXCIuL0V4dGVuZGVkTGlzdFwiO1xyXG4iLCIvLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0XCJyb290XCI6IFwiRGVtb19yb290X18xWDl1d1wiLFxuXHRcInRvZG9cIjogXCJEZW1vX3RvZG9fXzFnWWRsXCIsXG5cdFwibmVzdGVkXCI6IFwiRGVtb19uZXN0ZWRfXzJPWTVKXCJcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBUaGlzIGlzIHRoZSBsaW5rIChicmlkZ2UpIGJldHdlZW4gdGhlIFN0b3JlIGFuZCBlbGVtZW50IGFjdGlvbnMvY2xhc3Nlcy5cclxuICogQWJzdHJhY3QgaXMgZXNzZW50aWFsIGZvciBEcmFnZ2FibGUgJiBleHRlbmRlZCBTdG9yZS5cclxuICovXHJcbnZhciBBYnN0cmFjdENvcmVJbnN0YW5jZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBBYnN0cmFjdENvcmVJbnN0YW5jZS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gQWJzdHJhY3RDb3JlSW5zdGFuY2UoX2EpIHtcclxuICAgICAgICB2YXIgcmVmID0gX2EucmVmLCBpZCA9IF9hLmlkLCBkZXB0aCA9IF9hLmRlcHRoO1xyXG4gICAgICAgIHRoaXMucmVmID0gcmVmO1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmRlcHRoID0gZGVwdGg7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2luY2UgZWxlbWVudCByZW5kZXIgb25jZSBhbmQgYmVpbmcgdHJhbnNmb3JtZWQgbGF0ZXIgd2Uga2VlcCB0aGUgZGF0YVxyXG4gICAgICAgICAqIHN0b3JlZCB0byBuYXZpZ2F0ZSBjb3JyZWN0bHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGVZID0gMDtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZVggPSAwO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIEFic3RyYWN0Q29yZUluc3RhbmNlO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBBYnN0cmFjdENvcmVJbnN0YW5jZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QWJzdHJhY3RDb3JlSW5zdGFuY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIEphbGFsIE1hc2tvdW4uXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEFHUEwzLjAgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXHJcbnZhciBBYnN0cmFjdENvcmVJbnN0YW5jZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL0Fic3RyYWN0Q29yZUluc3RhbmNlXCIpKTtcclxudmFyIENvcmVJbnN0YW5jZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhDb3JlSW5zdGFuY2UsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBDb3JlSW5zdGFuY2UoZWxlbWVudFdpdGhQb2ludGVyLCBpc1BhdXNlKSB7XHJcbiAgICAgICAgaWYgKGlzUGF1c2UgPT09IHZvaWQgMCkgeyBpc1BhdXNlID0gZmFsc2U7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvcmRlciA9IGVsZW1lbnRXaXRoUG9pbnRlci5vcmRlciwga2V5cyA9IGVsZW1lbnRXaXRoUG9pbnRlci5rZXlzLCBlbGVtZW50ID0gX19yZXN0KGVsZW1lbnRXaXRoUG9pbnRlciwgW1wib3JkZXJcIiwgXCJrZXlzXCJdKTtcclxuICAgICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGVsZW1lbnQpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMucHJldlRyYW5zbGF0ZVkgPSBbXTtcclxuICAgICAgICBfdGhpcy5vZmZzZXQgPSB7XHJcbiAgICAgICAgICAgIGhlaWdodDogMCxcclxuICAgICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm9yZGVyID0gb3JkZXI7XHJcbiAgICAgICAgX3RoaXMua2V5cyA9IGtleXM7XHJcbiAgICAgICAgX3RoaXMuaXNWaXNpYmxlID0gIWlzUGF1c2U7XHJcbiAgICAgICAgaWYgKF90aGlzLnJlZiAmJiBfdGhpcy5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgX3RoaXMuaW5pdEluZGljYXRvcnMoKTtcclxuICAgICAgICAgICAgX3RoaXMucmVmLmRhdGFzZXQuaW5kZXggPSBcIlwiICsgX3RoaXMub3JkZXIuc2VsZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgZWxlbWVudCBvZmZzZXQgb25seSB3aGVuIGl0J3MgY2FsbGVkLiBTaW5jZSBpdCBpcyBzb3J0aW5nXHJcbiAgICAgKiBkaWZmZXJlbnQgbnVtYmVycyByZWxhdGVkIHRvIHRyYW5zZm9ybWF0aW9uIHdlIGRvbid0IG5lZWQgdG8gaW52b2tlIGZvclxyXG4gICAgICogaWRsZSBlbGVtZW50IGJlY2F1c2UgaXQncyBjb3N0bHkuXHJcbiAgICAgKlxyXG4gICAgICogU28sIGJhc2ljYWxseSBhbnkgd29ya2luZyBlbGVtZW50IGluIERuRCBzaG91bGQgYmUgaW5pdGlhdGVkIGZpcnN0LlxyXG4gICAgICovXHJcbiAgICBDb3JlSW5zdGFuY2UucHJvdG90eXBlLmluaXRJbmRpY2F0b3JzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucmVmLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBoZWlnaHQgPSBfYS5oZWlnaHQsIHdpZHRoID0gX2Eud2lkdGgsIGxlZnQgPSBfYS5sZWZ0LCB0b3AgPSBfYS50b3A7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRWxlbWVudCBvZmZzZXQgc3RvcmVkIG9uY2Ugd2l0aG91dCBiZWluZyB0cmlnZ2VyZWQgdG8gcmUtY2FsY3VsYXRlLlxyXG4gICAgICAgICAqIEluc3RlYWQsIHVzaW5nIGN1cnJlbnRPZmZzZXQgb2JqZWN0IGFzIGluZGljYXRvciB0byBjdXJyZW50XHJcbiAgICAgICAgICogb2Zmc2V0L3Bvc2l0aW9uLiBUaGlzIG9mZnNldCwgaXMgdGhlIGluaXQtb2Zmc2V0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0ge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcclxuICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICBsZWZ0OiBNYXRoLmFicyhsZWZ0KSxcclxuICAgICAgICAgICAgdG9wOiBNYXRoLmFicyh0b3ApLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VG9wID0gdGhpcy5vZmZzZXQudG9wO1xyXG4gICAgICAgIHRoaXMuY3VycmVudExlZnQgPSB0aGlzLm9mZnNldC5sZWZ0O1xyXG4gICAgfTtcclxuICAgIENvcmVJbnN0YW5jZS5wcm90b3R5cGUudmlzaWJpbGl0eUhhc0NoYW5nZWQgPSBmdW5jdGlvbiAoaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgaWYgKGlzVmlzaWJsZSA9PT0gdGhpcy5pc1Zpc2libGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAoaXNWaXNpYmxlICYmICF0aGlzLmlzVmlzaWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUVsbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IGlzVmlzaWJsZTtcclxuICAgIH07XHJcbiAgICBDb3JlSW5zdGFuY2UucHJvdG90eXBlLnVwZGF0ZUN1cnJlbnRJbmRpY2F0b3JzID0gZnVuY3Rpb24gKHRvcFNwYWNlLCBsZWZ0U3BhY2UpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZVkgKz0gdG9wU3BhY2U7XHJcbiAgICAgICAgdGhpcy50cmFuc2xhdGVYICs9IGxlZnRTcGFjZTtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLm9mZnNldCwgbGVmdCA9IF9hLmxlZnQsIHRvcCA9IF9hLnRvcDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGlzIG9mZnNldCByZWxhdGVkIGRpcmVjdGx5IHRvIHRyYW5zbGF0ZSBZIGFuZCBZLiBJdCdzIGlzb2xhdGVkIGZyb21cclxuICAgICAgICAgKiBlbGVtZW50IGN1cnJlbnQgb2Zmc2V0IGFuZCBlZmZlY3RzIG9ubHkgdG9wIGFuZCBsZWZ0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRvcCA9IHRvcCArIHRoaXMudHJhbnNsYXRlWTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0ID0gbGVmdCArIHRoaXMudHJhbnNsYXRlWDtcclxuICAgIH07XHJcbiAgICBDb3JlSW5zdGFuY2UucHJvdG90eXBlLnRyYW5zZm9ybUVsbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnJlZi5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKFwiICsgdGhpcy50cmFuc2xhdGVYICsgXCJweCxcIiArIHRoaXMudHJhbnNsYXRlWSArIFwicHgsIDApXCI7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiAgVXBkYXRlIGVsZW1lbnQgaW5kZXggaW4gb3JkZXIgIGJyYW5jaFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpIC0gaW5kZXhcclxuICAgICAqL1xyXG4gICAgQ29yZUluc3RhbmNlLnByb3RvdHlwZS51cGRhdGVPcmRlckluZGV4aW5nID0gZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICB2YXIgb2xkSW5kZXggPSB0aGlzLm9yZGVyLnNlbGY7XHJcbiAgICAgICAgdmFyIG5ld0luZGV4ID0gb2xkSW5kZXggKyBpO1xyXG4gICAgICAgIHRoaXMub3JkZXIuc2VsZiA9IG5ld0luZGV4O1xyXG4gICAgICAgIHJldHVybiB7IG9sZEluZGV4OiBvbGRJbmRleCwgbmV3SW5kZXg6IG5ld0luZGV4IH07XHJcbiAgICB9O1xyXG4gICAgQ29yZUluc3RhbmNlLnByb3RvdHlwZS5hc3NpZ25OZXdQb3NpdGlvbiA9IGZ1bmN0aW9uIChicmFuY2hJRHNPcmRlciwgbmV3SW5kZXgsIG9sZEluZGV4LCBzaWJsaW5nc0VtcHR5RWxtSW5kZXgpIHtcclxuICAgICAgICBpZiAob2xkSW5kZXggPT09IHZvaWQgMCkgeyBvbGRJbmRleCA9IC0xOyB9XHJcbiAgICAgICAgaWYgKHNpYmxpbmdzRW1wdHlFbG1JbmRleCA9PT0gdm9pZCAwKSB7IHNpYmxpbmdzRW1wdHlFbG1JbmRleCA9IC0xOyB9XHJcbiAgICAgICAgaWYgKG5ld0luZGV4IDwgMCB8fCBuZXdJbmRleCA+IGJyYW5jaElEc09yZGVyLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbGxlZ2FsIEF0dGVtcHQ6IFJlY2VpdmVkIGFuIGluZGV4OlwiICsgbmV3SW5kZXggKyBcIiBvbiBzaWJsaW5ncyBsaXN0OlwiICsgKGJyYW5jaElEc09yZGVyLmxlbmd0aCAtIDEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc2libGluZ3NFbXB0eUVsbUluZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBpZiAoc2libGluZ3NFbXB0eUVsbUluZGV4ID49IDAgJiYgc2libGluZ3NFbXB0eUVsbUluZGV4ICE9PSBuZXdJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIklsbGVnYWwgQXR0ZW1wdDogTW9yZSB0aGFuIG9uZSBlbGVtZW50IGhhdmUgbGVmdCB0aGUgc2libGluZ3MgbGlzdFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBzaWJsaW5nc0VtcHR5RWxtSW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJhbmNoSURzT3JkZXJbb2xkSW5kZXhdID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYnJhbmNoSURzT3JkZXJbbmV3SW5kZXhdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbGxlZ2FsIEF0dGVtcHQ6IENvbGxpZGluZyBpbiBwb3NpdGlvbnNcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNpYmxpbmdzRW1wdHlFbG1JbmRleDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJhbmNoSURzT3JkZXJbbmV3SW5kZXhdID0gdGhpcy5pZDtcclxuICAgICAgICB0aGlzLnJlZi5kYXRhc2V0LmluZGV4ID0gXCJcIiArIG5ld0luZGV4O1xyXG4gICAgICAgIHJldHVybiBvbGRJbmRleDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqICBTZXQgYSBuZXcgdHJhbnNsYXRlIHBvc2l0aW9uIGFuZCBzdG9yZSB0aGUgb2xkIG9uZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdG9wU3BhY2UgLVxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvbklEICAtIE9ubHkgaWYgbW92aW5nIHRvIGEgbmV3IHBvc2l0aW9uLlxyXG4gICAgICovXHJcbiAgICBDb3JlSW5zdGFuY2UucHJvdG90eXBlLnNlVHJhbnNsYXRlID0gZnVuY3Rpb24gKHRvcFNwYWNlLCBvcGVyYXRpb25JRCkge1xyXG4gICAgICAgIGlmIChvcGVyYXRpb25JRCkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZUcmFuc2xhdGVZLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgSUQ6IG9wZXJhdGlvbklELFxyXG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlWTogdGhpcy50cmFuc2xhdGVZLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVDdXJyZW50SW5kaWNhdG9ycyh0b3BTcGFjZSwgMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUVsbSgpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogU2V0cyBuZXcgdmVydGljYWwgcG9zaXRpb24uIFdoaWNoIGluY2x1ZGVzLCBUcmFuc2xhdGVZIGFuZCBPZmZzZXRUb3AuIEJ5IGFzc2lnbmluZyB0aGVcclxuICAgICAqIG5ldyBjYWxjdWxhdGVkIHZhbHVlIGJ5ICsvLSBuZXcgZGlmZmVyZW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBOb3RlOiBXaHkgd2UgZG9uJ3QgbmVlZCBzZXRYUG9zaXRpb24/XHJcbiAgICAgKiBCZWNhdXNlLCBlbGVtZW50cyBhbHdheXMgbW92ZSBpbiB0aGUgc2FtZSBsaXN0IGNvbnRhaW5lciwgdGhlIG9ubHkgb25lIHdobydzIG1pZ3JhdGVkIHRvXHJcbiAgICAgKiBhbm90aGVyIGlzIGRyYWdnZWQuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogaXNTaHVmZmxlIGlzIGZsYWcgbWFkZSBmb3IgdXBkYXRpbmcgbGFzdCBlbGVtZW50IGluIGFycmF5XHJcbiAgICAgKiB3aGljaCBpcyBkcmFnZ2VkLiBOb3JtYWxseSwgdXBkYXRlIGVsZW1lbnQgcG9zaXRpb24gYW5kIGNsZWFyIGl0cyBwcmV2aW91c1xyXG4gICAgICogcG9zaXRpb24gYnV0IHdoZW4gdXBkYXRpbmcgbGFzdCBlbGVtZW50IHRoZSBhcnJheSBpcyByZWFkeSBhbmQgZG9uZSB3ZSBuZWVkXHJcbiAgICAgKiB0byB1cGRhdGUgb25lIHBvc2l0aW9uIG9ubHkgc28gZG9uJ3QgY2xlYXIgcHJldmlvdXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlEc0luT3JkZXIgLVxyXG4gICAgICogQHBhcmFtIHNpZ24gLSAoKzEvLTEpXHJcbiAgICAgKiBAcGFyYW0gdG9wU3BhY2UgLSBzcGFjZSBiZXR3ZWVuIGRyYWdnZWQgYW5kIHRoZSBpbW1lZGlhdGUgbmV4dCBlbGVtZW50LlxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvbklEIC0gQSB1bmlxdWUgSUQgdXNlZCB0byBzdG9yZSB0cmFuc2xhdGUgaGlzdG9yeVxyXG4gICAgICogQHBhcmFtIHZJbmNyZW1lbnQgLSB0aGUgbnVtYmVyIG9mIHBhc3NlZCBlbGVtZW50cy5cclxuICAgICAqIEBwYXJhbSBpc1NodWZmbGUgLVxyXG4gICAgICovXHJcbiAgICBDb3JlSW5zdGFuY2UucHJvdG90eXBlLnNldFlQb3NpdGlvbiA9IGZ1bmN0aW9uIChpRHNJbk9yZGVyLCBzaWduLCB0b3BTcGFjZSwgb3BlcmF0aW9uSUQsIHNpYmxpbmdzRW1wdHlFbG1JbmRleCwgdkluY3JlbWVudCwgaXNTaHVmZmxlKSB7XHJcbiAgICAgICAgaWYgKHNpYmxpbmdzRW1wdHlFbG1JbmRleCA9PT0gdm9pZCAwKSB7IHNpYmxpbmdzRW1wdHlFbG1JbmRleCA9IC0xOyB9XHJcbiAgICAgICAgaWYgKHZJbmNyZW1lbnQgPT09IHZvaWQgMCkgeyB2SW5jcmVtZW50ID0gMTsgfVxyXG4gICAgICAgIGlmIChpc1NodWZmbGUgPT09IHZvaWQgMCkgeyBpc1NodWZmbGUgPSB0cnVlOyB9XHJcbiAgICAgICAgdGhpcy5zZVRyYW5zbGF0ZShzaWduICogdG9wU3BhY2UsIG9wZXJhdGlvbklEKTtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnVwZGF0ZU9yZGVySW5kZXhpbmcoc2lnbiAqIHZJbmNyZW1lbnQpLCBvbGRJbmRleCA9IF9hLm9sZEluZGV4LCBuZXdJbmRleCA9IF9hLm5ld0luZGV4O1xyXG4gICAgICAgIHZhciBuZXdTdGF0dXNTaWJsaW5nc0hhc0VtcHR5RWxtID0gdGhpcy5hc3NpZ25OZXdQb3NpdGlvbihpRHNJbk9yZGVyLCBuZXdJbmRleCwgaXNTaHVmZmxlID8gb2xkSW5kZXggOiB1bmRlZmluZWQsIHNpYmxpbmdzRW1wdHlFbG1JbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIG5ld1N0YXR1c1NpYmxpbmdzSGFzRW1wdHlFbG07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBSb2xsIGJhY2sgZWxlbWVudCBwb3NpdGlvbiB2ZXJ0aWNhbGx5KHkpLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBvcGVyYXRpb25JRCAtXHJcbiAgICAgKi9cclxuICAgIENvcmVJbnN0YW5jZS5wcm90b3R5cGUucm9sbFlCYWNrID0gZnVuY3Rpb24gKG9wZXJhdGlvbklEKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJldlRyYW5zbGF0ZVkubGVuZ3RoID09PSAwIHx8XHJcbiAgICAgICAgICAgIHRoaXMucHJldlRyYW5zbGF0ZVlbdGhpcy5wcmV2VHJhbnNsYXRlWS5sZW5ndGggLSAxXS5JRCAhPT0gb3BlcmF0aW9uSUQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdmFyIHRyYW5zbGF0ZVkgPSB0aGlzLnByZXZUcmFuc2xhdGVZLnBvcCgpLnRyYW5zbGF0ZVk7XHJcbiAgICAgICAgdmFyIHRvcFNwYWNlID0gdHJhbnNsYXRlWSAtIHRoaXMudHJhbnNsYXRlWTtcclxuICAgICAgICB2YXIgaW5jcmVtZW50ID0gdG9wU3BhY2UgPiAwID8gMSA6IC0xO1xyXG4gICAgICAgIHRoaXMuc2VUcmFuc2xhdGUodG9wU3BhY2UpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlT3JkZXJJbmRleGluZyhpbmNyZW1lbnQpO1xyXG4gICAgICAgIHRoaXMucm9sbFlCYWNrKG9wZXJhdGlvbklEKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQ29yZUluc3RhbmNlO1xyXG59KEFic3RyYWN0Q29yZUluc3RhbmNlXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBDb3JlSW5zdGFuY2U7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvcmVJbnN0YW5jZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XHJcbnZhciBDb3JlSW5zdGFuY2VfMSA9IHJlcXVpcmUoXCIuL0NvcmVJbnN0YW5jZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX19pbXBvcnREZWZhdWx0KENvcmVJbnN0YW5jZV8xKS5kZWZhdWx0OyB9IH0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxyXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBEcmFnZ2FibGVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9EcmFnZ2FibGVcIikpO1xyXG52YXIgRHJvcHBhYmxlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vRHJvcHBhYmxlXCIpKTtcclxudmFyIERuRFN0b3JlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vRG5EU3RvcmVcIikpO1xyXG52YXIgZGVmYXVsdE9wdHMgPSBPYmplY3QuZnJlZXplKHtcclxuICAgIHRocmVzaG9sZHM6IHtcclxuICAgICAgICB2ZXJ0aWNhbDogNjAsXHJcbiAgICAgICAgaG9yaXpvbnRhbDogNjAsXHJcbiAgICB9LFxyXG4gICAgcmVzdHJpY3Rpb25zOiB7XHJcbiAgICAgICAgYWxsb3dMZWF2aW5nRnJvbVRvcDogdHJ1ZSxcclxuICAgICAgICBhbGxvd0xlYXZpbmdGcm9tQm90dG9tOiB0cnVlLFxyXG4gICAgICAgIGFsbG93TGVhdmluZ0Zyb21MZWZ0OiB0cnVlLFxyXG4gICAgICAgIGFsbG93TGVhdmluZ0Zyb21SaWdodDogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBzY3JvbGw6IHtcclxuICAgICAgICBlbmFibGU6IHRydWUsXHJcbiAgICAgICAgc3BlZWQ6IDEwLFxyXG4gICAgICAgIHRocmVzaG9sZDogNTAsXHJcbiAgICB9LFxyXG59KTtcclxudmFyIERuRCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhEbkQsIF9zdXBlcik7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaWQgLVxyXG4gICAgICogQHBhcmFtIGluaXRDb29yZGluYXRlcyAtXHJcbiAgICAgKiBAcGFyYW0gb3B0cyAtXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIERuRChpZCwgaW5pdENvb3JkaW5hdGVzLCBvcHRzKSB7XHJcbiAgICAgICAgaWYgKG9wdHMgPT09IHZvaWQgMCkgeyBvcHRzID0gZGVmYXVsdE9wdHM7IH1cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBlbG1Db3JlSW5zdGFuY2VXaXRoVHJlZSA9IERuRFN0b3JlXzEuZGVmYXVsdC5nZXRFbG1UcmVlQnlJZChpZCk7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBfX2Fzc2lnbih7fSwgb3B0cyk7XHJcbiAgICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdE9wdHMpLmZvckVhY2goZnVuY3Rpb24gKHByb3BzKSB7XHJcbiAgICAgICAgICAgIGlmICghb3B0aW9uc1twcm9wc10pIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnNbcHJvcHNdID0gZGVmYXVsdE9wdHNbcHJvcHNdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1twcm9wc10gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVmYXVsdE9wdHNbcHJvcHNdKSwgb3B0aW9uc1twcm9wc10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRyYWdnYWJsZSA9IG5ldyBEcmFnZ2FibGVfMS5kZWZhdWx0KGVsbUNvcmVJbnN0YW5jZVdpdGhUcmVlLCBpbml0Q29vcmRpbmF0ZXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZHJhZ2dhYmxlKSB8fCB0aGlzO1xyXG4gICAgICAgIHJldHVybiBfdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBEbkQ7XHJcbn0oRHJvcHBhYmxlXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBEbkQ7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURuRC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgc3RvcmVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiQGRmbGV4L3N0b3JlXCIpKTtcclxudmFyIGNvcmVfaW5zdGFuY2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiQGRmbGV4L2NvcmUtaW5zdGFuY2VcIikpO1xyXG52YXIgVHJhY2tlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL1RyYWNrZXJcIikpO1xyXG4vLyBpbXBvcnQgRW52aXJvbm1lbnQgZnJvbSBcIi4uL0Vudmlyb25tZW50XCI7XHJcbi8vIGZ1bmN0aW9uIG5vb3AoKSB7fVxyXG4vLyBjb25zdCBoYW5kbGVycyA9IFtcIm9uRHJhZ092ZXJcIiwgXCJvbkRyYWdMZWF2ZVwiXTtcclxuZnVuY3Rpb24gY2FuVXNlRE9NKCkge1xyXG4gICAgcmV0dXJuICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgdHlwZW9mIHdpbmRvdy5kb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxyXG4gICAgICAgIHR5cGVvZiB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIik7XHJcbn1cclxudmFyIERuRFN0b3JlSW1wID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKERuRFN0b3JlSW1wLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gRG5EU3RvcmVJbXAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5zaWJsaW5nc0JvdW5kYXJpZXMgPSB7fTtcclxuICAgICAgICBfdGhpcy50cmFja2VyID0gbmV3IFRyYWNrZXJfMS5kZWZhdWx0KCk7XHJcbiAgICAgICAgX3RoaXMuaW5pdEVMbUluZGljYXRvcigpO1xyXG4gICAgICAgIF90aGlzLmFuaW1hdGVkU2Nyb2xsID0gX3RoaXMuYW5pbWF0ZWRTY3JvbGwuYmluZChfdGhpcyk7XHJcbiAgICAgICAgX3RoaXMuc2V0Vmlld3BvcnQgPSBfdGhpcy5zZXRWaWV3cG9ydC5iaW5kKF90aGlzKTtcclxuICAgICAgICBfdGhpcy5pc0RPTSA9IGNhblVzZURPTSgpO1xyXG4gICAgICAgIGlmIChfdGhpcy5pc0RPTSkge1xyXG4gICAgICAgICAgICBfdGhpcy5pbml0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF90aGlzLnRocm90dGxlID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgRG5EU3RvcmVJbXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWaWV3cG9ydCgpO1xyXG4gICAgICAgIHRoaXMuc2V0U2Nyb2xsWFkoKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLnNldFZpZXdwb3J0KTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmFuaW1hdGVkU2Nyb2xsKTtcclxuICAgICAgICB3aW5kb3cub25iZWZvcmV1bmxvYWQgPSB0aGlzLmNsZWFudXA7XHJcbiAgICB9O1xyXG4gICAgRG5EU3RvcmVJbXAucHJvdG90eXBlLnNldFZpZXdwb3J0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IHx8IDAsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKTtcclxuICAgICAgICB0aGlzLnZpZXdwb3J0V2lkdGggPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggfHwgMCwgd2luZG93LmlubmVyV2lkdGggfHwgMCk7XHJcbiAgICB9O1xyXG4gICAgRG5EU3RvcmVJbXAucHJvdG90eXBlLnNldFNjcm9sbFhZID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsWSA9IE1hdGgucm91bmQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCB3aW5kb3cucGFnZVlPZmZzZXQpO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsWCA9IE1hdGgucm91bmQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgd2luZG93LnBhZ2VYT2Zmc2V0KTtcclxuICAgIH07XHJcbiAgICBEbkRTdG9yZUltcC5wcm90b3R5cGUuaW5pdEVMbUluZGljYXRvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmVsbUluZGljYXRvciA9IHtcclxuICAgICAgICAgICAgY3VycmVudEt5OiBcIlwiLFxyXG4gICAgICAgICAgICBwcmV2S3k6IFwiXCIsXHJcbiAgICAgICAgICAgIGV4Y2VwdGlvblRvTmV4dEVsbTogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcbiAgICBEbkRTdG9yZUltcC5wcm90b3R5cGUuaXNFbGVtZW50SGlkZGVuSW5WaWV3cG9ydCA9IGZ1bmN0aW9uIChjdXJyZW50VG9wLCBjdXJyZW50TGVmdCkge1xyXG4gICAgICAgIHJldHVybiAoY3VycmVudFRvcCA8IHRoaXMuc2Nyb2xsWSB8fFxyXG4gICAgICAgICAgICBjdXJyZW50VG9wID49IHRoaXMudmlld3BvcnRIZWlnaHQgKyB0aGlzLnNjcm9sbFkgfHxcclxuICAgICAgICAgICAgY3VycmVudExlZnQgPCB0aGlzLnNjcm9sbFggfHxcclxuICAgICAgICAgICAgY3VycmVudExlZnQgPj0gdGhpcy52aWV3cG9ydFdpZHRoICsgdGhpcy5zY3JvbGxYKTtcclxuICAgIH07XHJcbiAgICBEbkRTdG9yZUltcC5wcm90b3R5cGUudXBkYXRlUmVnaXN0ZXJlZExheW91dEluZGljYXRvcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmluaXRFTG1JbmRpY2F0b3IoKTtcclxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLkRPTUdlbi5icmFuY2hlcykuZm9yRWFjaChmdW5jdGlvbiAoYnJhbmNoS2V5KSB7XHJcbiAgICAgICAgICAgIC8vIElnbm9yZSBub24gYXJyYXkgYnJhbmNoZXMuXHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KF90aGlzLkRPTUdlbi5icmFuY2hlc1ticmFuY2hLZXldKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZJbmRleF8xID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLkRPTUdlbi5icmFuY2hlc1ticmFuY2hLZXldLmZvckVhY2goZnVuY3Rpb24gKGVsbUlELCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsbUlELmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hID0gX3RoaXMucmVnaXN0cnlbZWxtSURdLCBjdXJyZW50VG9wID0gX2EuY3VycmVudFRvcCwgY3VycmVudExlZnQgPSBfYS5jdXJyZW50TGVmdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlzVmlzaWJsZSA9ICFfdGhpcy5pc0VsZW1lbnRIaWRkZW5JblZpZXdwb3J0KGN1cnJlbnRUb3AsIGN1cnJlbnRMZWZ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1Zpc2libGUgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFfdGhpcy5lbG1JbmRpY2F0b3IuZXhjZXB0aW9uVG9OZXh0RWxtICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID4gcHJldkluZGV4XzEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmVsbUluZGljYXRvci5leGNlcHRpb25Ub05leHRFbG0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWaXNpYmxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpc1Zpc2libGUgJiYgX3RoaXMuZWxtSW5kaWNhdG9yLmV4Y2VwdGlvblRvTmV4dEVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSW4gdGhpcyBjYXNlLCB3ZSBhcmUgbW92aW5nIGZyb20gaGlkZGVuIHRvIHZpc2libGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFZzogMSwgMiBhcmUgaGlkZGVuIHRoZSByZXN0IG9mIHRoZSBsaXN0IGlzIHZpc2libGUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCdXQsIHRoZXJlJ3MgYSBwb3NzaWJpbGl0eSB0aGF0IHRoZSByZXN0IG9mIHRoZSBicmFuY2ggZWxlbWVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFyZSBoaWRkZW4uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBFZzogMSwgMjogaGlkZGVuIDMsIDQsIDUsIDYsIDc6dmlzaWJsZSA4LCA5LCAxMDogaGlkZGVuLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaW5pdEVMbUluZGljYXRvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnJlZ2lzdHJ5W2VsbUlEXS52aXNpYmlsaXR5SGFzQ2hhbmdlZChpc1Zpc2libGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2SW5kZXhfMSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBEbkRTdG9yZUltcC5wcm90b3R5cGUuYXNzaWduU2libGluZ3NCb3VuZGFyaWVzID0gZnVuY3Rpb24gKHNpYmxpbmdzSywgZWxlbU9mZnNldCkge1xyXG4gICAgICAgIHZhciBlbG1SaWdodCA9IGVsZW1PZmZzZXQubGVmdCArIGVsZW1PZmZzZXQud2lkdGg7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNpYmxpbmdzQm91bmRhcmllc1tzaWJsaW5nc0tdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2libGluZ3NCb3VuZGFyaWVzW3NpYmxpbmdzS10gPSB7XHJcbiAgICAgICAgICAgICAgICB0b3A6IGVsZW1PZmZzZXQudG9wLFxyXG4gICAgICAgICAgICAgICAgbWF4TGVmdDogZWxlbU9mZnNldC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgbWluUmlnaHQ6IGVsbVJpZ2h0LFxyXG4gICAgICAgICAgICAgICAgYm90dG9tOiBlbGVtT2Zmc2V0LmhlaWdodCxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgJCA9IHRoaXMuc2libGluZ3NCb3VuZGFyaWVzW3NpYmxpbmdzS107XHJcbiAgICAgICAgaWYgKCQubWF4TGVmdCA8IGVsZW1PZmZzZXQubGVmdCkge1xyXG4gICAgICAgICAgICAkLm1heExlZnQgPSBlbGVtT2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgkLm1pblJpZ2h0ID4gZWxtUmlnaHQpIHtcclxuICAgICAgICAgICAgJC5taW5SaWdodCA9IGVsbVJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJC50b3AgPiBlbGVtT2Zmc2V0LnRvcCkge1xyXG4gICAgICAgICAgICAkLnRvcCA9IGVsZW1PZmZzZXQudG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgJC5ib3R0b20gPSBlbGVtT2Zmc2V0LnRvcCArIGVsZW1PZmZzZXQuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFJlYXR0YWNoIGVsZW1lbnQgcmVmZXJlbmNlLlxyXG4gICAgICogVGhpcyBoYXBwZW5zIHdoZW4gZWxlbWVudCBpcyB1bm1vdW50ZWQgZnJvbSB0aGUgc2NyZWVuIGFuZCBtb3VudGVkIGFnYWluLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpZCAtXHJcbiAgICAgKiBAcGFyYW0gZWxtUmVmIC1cclxuICAgICAqL1xyXG4gICAgRG5EU3RvcmVJbXAucHJvdG90eXBlLnJlYXR0YWNoRWxtUmVmID0gZnVuY3Rpb24gKGlkLCBlbG1SZWYpIHtcclxuICAgICAgICB0aGlzLnJlZ2lzdHJ5W2lkXS5yZWYgPSBlbG1SZWY7XHJcbiAgICAgICAgLy8gUHJlc2VydmVzIGxhc3QgY2hhbmdlcy5cclxuICAgICAgICB0aGlzLnJlZ2lzdHJ5W2lkXS50cmFuc2Zvcm1FbG0oKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqICBSZWdpc3RlciBEbkQgZWxlbWVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudCAtXHJcbiAgICAgKi9cclxuICAgIERuRFN0b3JlSW1wLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRE9NKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNET00gPSBjYW5Vc2VET00oKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzRE9NKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSWYgZWxlbWVudCBhbHJlYWR5IGV4aXN0IGluIHRoZSBzdG9yZSwgdGhlbiB0aGUgcmVhdHRhY2ggdGhlIHJlZmVyZW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgaWQgPSBlbGVtZW50LmlkIHx8IGVsZW1lbnQucmVmLmlkO1xyXG4gICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W2lkXSkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5yZWYpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlZ2lzdHJ5W2lkXS5yZWYuaXNFcXVhbE5vZGUoZWxlbWVudC5yZWYpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWF0dGFjaEVsbVJlZihpZCwgZWxlbWVudC5yZWYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiREZsZXg6IEVsZW1lbnQgd2l0aCBpZDpcIiArIGlkICsgXCIgaXMgYWxyZWFkeSByZWdpc3RlcmVkLiBQbGVhc2UsIHByb3ZpZGUgREZsZXggd2l0aCBhIHVuaXF1ZSBpZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfc3VwZXIucHJvdG90eXBlLnJlZ2lzdGVyLmNhbGwodGhpcywgZWxlbWVudCwgY29yZV9pbnN0YW5jZV8xLmRlZmF1bHQpO1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucmVnaXN0cnlbaWRdLCBjdXJyZW50VG9wID0gX2EuY3VycmVudFRvcCwgY3VycmVudExlZnQgPSBfYS5jdXJyZW50TGVmdCwgb2Zmc2V0ID0gX2Eub2Zmc2V0LCBfYiA9IF9hLmtleXMsIHNLID0gX2Iuc0ssIHBLID0gX2IucEs7XHJcbiAgICAgICAgdGhpcy5hc3NpZ25TaWJsaW5nc0JvdW5kYXJpZXMoc0ssIG9mZnNldCk7XHJcbiAgICAgICAgdmFyIGlzVmlzaWJsZSA9ICF0aGlzLmlzRWxlbWVudEhpZGRlbkluVmlld3BvcnQoY3VycmVudFRvcCwgY3VycmVudExlZnQpO1xyXG4gICAgICAgIC8vIHNhbWUgYnJhbmNoXHJcbiAgICAgICAgdGhpcy5lbG1JbmRpY2F0b3IuY3VycmVudEt5ID0gXCJcIiArIHNLICsgcEs7XHJcbiAgICAgICAgaWYgKCFpc1Zpc2libGUgJiZcclxuICAgICAgICAgICAgIXRoaXMuZWxtSW5kaWNhdG9yLmV4Y2VwdGlvblRvTmV4dEVsbSAmJlxyXG4gICAgICAgICAgICB0aGlzLmVsbUluZGljYXRvci5jdXJyZW50S3kgPT09IHRoaXMuZWxtSW5kaWNhdG9yLnByZXZLeSkge1xyXG4gICAgICAgICAgICB0aGlzLmVsbUluZGljYXRvci5leGNlcHRpb25Ub05leHRFbG0gPSB0cnVlO1xyXG4gICAgICAgICAgICBpc1Zpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlZ2lzdHJ5W2lkXS5pc1Zpc2libGUgPSBpc1Zpc2libGU7XHJcbiAgICAgICAgdGhpcy5lbG1JbmRpY2F0b3IucHJldkt5ID0gdGhpcy5lbG1JbmRpY2F0b3IuY3VycmVudEt5O1xyXG4gICAgfTtcclxuICAgIERuRFN0b3JlSW1wLnByb3RvdHlwZS5nZXRFTG1PZmZzZXRCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxtQnlJZChpZCkub2Zmc2V0O1xyXG4gICAgfTtcclxuICAgIERuRFN0b3JlSW1wLnByb3RvdHlwZS5nZXRFTG1UcmFuc2xhdGVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5nZXRFbG1CeUlkKGlkKSwgdHJhbnNsYXRlWCA9IF9hLnRyYW5zbGF0ZVgsIHRyYW5zbGF0ZVkgPSBfYS50cmFuc2xhdGVZO1xyXG4gICAgICAgIHJldHVybiB7IHRyYW5zbGF0ZVg6IHRyYW5zbGF0ZVgsIHRyYW5zbGF0ZVk6IHRyYW5zbGF0ZVkgfTtcclxuICAgIH07XHJcbiAgICBEbkRTdG9yZUltcC5wcm90b3R5cGUuZ2V0RWxtU2libGluZ3NCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLmdldEVsbUJ5SWQoaWQpO1xyXG4gICAgICAgIHZhciBzSyA9IGVsZW1lbnQua2V5cy5zSztcclxuICAgICAgICB2YXIgc2libGluZ3MgPSB0aGlzLmdldEVsbUJyYW5jaEJ5S2V5KHNLKTtcclxuICAgICAgICByZXR1cm4gc2libGluZ3M7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIGVsZW1lbnQgY29ubmVjdGlvbnMgaW5zdGFuY2UgZm9yIGEgZ2l2ZW4gaWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkIC1cclxuICAgICAqL1xyXG4gICAgRG5EU3RvcmVJbXAucHJvdG90eXBlLmdldEVsbVRyZWVCeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLmdldEVsbUJ5SWQoaWQpO1xyXG4gICAgICAgIHZhciBfYSA9IGVsZW1lbnQua2V5cywgc0sgPSBfYS5zSywgcEsgPSBfYS5wSywgcGkgPSBlbGVtZW50Lm9yZGVyLnBhcmVudDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnZXR0aW5nIGNvbm5lY3RlZCBicmFuY2hlc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBzaWJsaW5ncyA9IHRoaXMuZ2V0RWxtQnJhbmNoQnlLZXkoc0spO1xyXG4gICAgICAgIHZhciBwYXJlbnRzID0gdGhpcy5nZXRFbG1CcmFuY2hCeUtleShwSyk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2V0dGluZyBwYXJlbnQgaW5zdGFuY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgcGFyZW50ID0gbnVsbDtcclxuICAgICAgICBpZiAocGFyZW50cyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRzSUQgPSBBcnJheS5pc0FycmF5KHBhcmVudHMpID8gcGFyZW50c1twaV0gOiBwYXJlbnRzO1xyXG4gICAgICAgICAgICBwYXJlbnQgPSB0aGlzLmdldEVsbUJ5SWQocGFyZW50c0lEKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcclxuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnQsXHJcbiAgICAgICAgICAgIGJyYW5jaGVzOiB7XHJcbiAgICAgICAgICAgICAgICBzaWJsaW5nczogc2libGluZ3MsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRzOiBwYXJlbnRzLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgRG5EU3RvcmVJbXAucHJvdG90eXBlLmFuaW1hdGVkU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZXRTY3JvbGxYWSgpO1xyXG4gICAgICAgIGlmICghdGhpcy50aHJvdHRsZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZVJlZ2lzdGVyZWRMYXlvdXRJbmRpY2F0b3JzKCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy50aHJvdHRsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy50aHJvdHRsZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIERuRFN0b3JlSW1wLnByb3RvdHlwZS5jbGVhbnVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuYW5pbWF0ZWRTY3JvbGwpO1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuc2V0Vmlld3BvcnQpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEbkRTdG9yZUltcDtcclxufShzdG9yZV8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gKGZ1bmN0aW9uIGNyZWF0ZVN0b3JlSW5zdGFuY2UoKSB7XHJcbiAgICB2YXIgc3RvcmUgPSBuZXcgRG5EU3RvcmVJbXAoKTtcclxuICAgIHJldHVybiBzdG9yZTtcclxufSkoKTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RG5EU3RvcmVJbXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgVHJhY2tlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBUcmFja2VyLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBUcmFja2VyKCkge1xyXG4gICAgICAgIHRoaXMudHJhdmVsSUQgPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmNyZW1lbnQgdHJhdmVscyBhbmQgcmV0dXJuIHRoZSBsYXN0IG9uZS5cclxuICAgICAqL1xyXG4gICAgVHJhY2tlci5wcm90b3R5cGUubmV3VHJhdmVsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMudHJhdmVsSUQgKz0gMTtcclxuICAgICAgICByZXR1cm4gXCJcIiArIHRoaXMudHJhdmVsSUQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFRyYWNrZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFRyYWNrZXI7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRyYWNrZXIuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xyXG52YXIgRG5EU3RvcmVJbXBfMSA9IHJlcXVpcmUoXCIuL0RuRFN0b3JlSW1wXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2ltcG9ydERlZmF1bHQoRG5EU3RvcmVJbXBfMSkuZGVmYXVsdDsgfSB9KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIEphbGFsIE1hc2tvdW4uXHJcbiAqXHJcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEFHUEwzLjAgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxyXG4gKi9cclxudmFyIGRyYWdnYWJsZV8xID0gcmVxdWlyZShcIkBkZmxleC9kcmFnZ2FibGVcIik7XHJcbnZhciBEbkRTdG9yZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9EbkRTdG9yZVwiKSk7XHJcbi8qKlxyXG4gKiBCYXNlIGVsZW1lbnQuXHJcbiAqXHJcbiAqIENyZWF0ZXMgZHJhZ2dlZEVsbSBhbmQgYWN0aXZlUGFyZW50IGFuZCBpbml0aWFsaXplcyB0aHJlc2hvbGRzLlxyXG4gKi9cclxudmFyIEJhc2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoQmFzZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEJhc2UoZWxtVHJlZSwgaW5pdENvb3JkaW5hdGVzLCBvcHRzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGVsbVRyZWUuZWxlbWVudCwgcGFyZW50ID0gZWxtVHJlZS5wYXJlbnQsIF9hID0gZWxtVHJlZS5icmFuY2hlcywgc2libGluZ3MgPSBfYS5zaWJsaW5ncywgcGFyZW50cyA9IF9hLnBhcmVudHM7XHJcbiAgICAgICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBlbGVtZW50LCBpbml0Q29vcmRpbmF0ZXMpIHx8IHRoaXM7XHJcbiAgICAgICAgdmFyIG9yZGVyID0gZWxlbWVudC5vcmRlcjtcclxuICAgICAgICBfdGhpcy5vcHRzID0gb3B0cztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbml0aWFsaXplIHRlbXAgaW5kZXggdGhhdCByZWZlcnMgdG8gZWxlbWVudCBuZXcgcG9zaXRpb24gYWZ0ZXJcclxuICAgICAgICAgKiB0cmFuc2Zvcm1hdGlvbiBoYXBwZW5lZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBfdGhpcy50ZW1wSW5kZXggPSBvcmRlci5zZWxmO1xyXG4gICAgICAgIF90aGlzLnBhcmVudHNMaXN0ID0gcGFyZW50cztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaHJlc2hvbGRzIHN0b3JlLCBjb250YWlucyBtYXggdmFsdWUgZm9yIGVhY2ggcGFyZW50IGFuZCBmb3IgZHJhZ2dlZC4gRGVwZW5kaW5nIG9uXHJcbiAgICAgICAgICogaWRzIGFzIGtleXMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgX3RoaXMudGhyZXNob2xkcyA9IHtcclxuICAgICAgICAgICAgc2libGluZ3M6IHt9LFxyXG4gICAgICAgICAgICBkcmFnZ2VkOiB7XHJcbiAgICAgICAgICAgICAgICBtYXhCb3R0b206IDAsXHJcbiAgICAgICAgICAgICAgICBtYXhUb3A6IDAsXHJcbiAgICAgICAgICAgICAgICBtYXhMZWZ0OiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4UmlnaHQ6IDAsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBfdGhpcy50aHJlc2hvbGRzUGVyY2VudGFnZXMgPSB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsOiBNYXRoLnJvdW5kKChfdGhpcy5vcHRzLnRocmVzaG9sZHMudmVydGljYWwgKiBfdGhpcy5kcmFnZ2VkRWxtLm9mZnNldC5oZWlnaHQpIC8gMTAwKSxcclxuICAgICAgICAgICAgaG9yaXpvbnRhbDogTWF0aC5yb3VuZCgoX3RoaXMub3B0cy50aHJlc2hvbGRzLmhvcml6b250YWwgKiBfdGhpcy5kcmFnZ2VkRWxtLm9mZnNldC53aWR0aCkgLyAxMDApLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5pdCBtYXggZGlyZWN0aW9uIGZvciBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF90aGlzLnNldFRocmVzaG9sZChfdGhpcy5kcmFnZ2VkRWxtLmN1cnJlbnRUb3AsIF90aGlzLmRyYWdnZWRFbG0uY3VycmVudExlZnQpO1xyXG4gICAgICAgIHZhciBzaWJsaW5nc0JvdW5kYXJpZXMgPSBEbkRTdG9yZV8xLmRlZmF1bHQuc2libGluZ3NCb3VuZGFyaWVzW0RuRFN0b3JlXzEuZGVmYXVsdC5yZWdpc3RyeVtfdGhpcy5kcmFnZ2VkRWxtLmlkXS5rZXlzLnNLXTtcclxuICAgICAgICBfdGhpcy5zZXRUaHJlc2hvbGQoc2libGluZ3NCb3VuZGFyaWVzLnRvcCwgc2libGluZ3NCb3VuZGFyaWVzLm1heExlZnQsIHNpYmxpbmdzQm91bmRhcmllcy5ib3R0b20sIERuRFN0b3JlXzEuZGVmYXVsdC5yZWdpc3RyeVtfdGhpcy5kcmFnZ2VkRWxtLmlkXS5rZXlzLnNLKTtcclxuICAgICAgICBfdGhpcy5zaWJsaW5nc0xpc3QgPSBBcnJheS5pc0FycmF5KHNpYmxpbmdzKSA/IHNpYmxpbmdzIDogbnVsbDtcclxuICAgICAgICBfdGhpcy5zZXRJc09ycGhhbihwYXJlbnQpO1xyXG4gICAgICAgIF90aGlzLm9wZXJhdGlvbklEID0gRG5EU3RvcmVfMS5kZWZhdWx0LnRyYWNrZXIubmV3VHJhdmVsKCk7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBkcmFnZ2VkIGhhcyBubyBwYXJlbnQgYW5kIHRoZW4gc2V0IHRoZSByZWxhdGVkIG9wZXJhdGlvbnNcclxuICAgICAqIGFjY29yZGluZ2x5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwYXJlbnQgLVxyXG4gICAgICovXHJcbiAgICBCYXNlLnByb3RvdHlwZS5zZXRJc09ycGhhbiA9IGZ1bmN0aW9uIChwYXJlbnQpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBOb3QgYWxsIGVsZW1lbnRzIGhhdmUgcGFyZW50cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbmRpY2F0b3IgdG8gcGFyZW50cyB0aGF0IGhhdmUgY2hhbmdlZC4gVGhpcyBmYWNpbGl0YXRlcyBsb29waW5nIGluXHJcbiAgICAgICAgICAgICAqIGFmZmVjdGVkIHBhcmVudHMgb25seS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuc2V0T2ZUcmFuc2Zvcm1lZElkcyA9IG5ldyBTZXQoW10pO1xyXG4gICAgICAgICAgICB0aGlzLmFzc2lnbkFjdGl2ZVBhcmVudChwYXJlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmlzT3V0QWN0aXZlUGFyZW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRHJhZ2dlZCBoYXMgbm8gcGFyZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVQYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFNldHMgdGhyZXNob2xkcyBmb3IgZHJhZ2dlZCBlbGVtZW50IHBvc2l0aW9uIGRlcGVuZGluZyBvbiBpdHNcclxuICAgICAqIHBvc2l0aW9uIGluc2lkZSBwYXJlbnQgd2hpY2ggaXMgcmVsYXRlZCB0byBkcm9wcGFibGUgbGVmdCBhbmQgdG9wLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0b3AgLVxyXG4gICAgICogQHBhcmFtIGxlZnQgLVxyXG4gICAgICogQHBhcmFtIGhlaWdodCAtXHJcbiAgICAgKiBAcGFyYW0gc2libGluZ3NLIC1cclxuICAgICAqL1xyXG4gICAgQmFzZS5wcm90b3R5cGUuc2V0VGhyZXNob2xkID0gZnVuY3Rpb24gKHRvcCwgbGVmdCwgaGVpZ2h0LCBzaWJsaW5nc0spIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnRocmVzaG9sZHNQZXJjZW50YWdlcywgdmVydGljYWwgPSBfYS52ZXJ0aWNhbCwgaG9yaXpvbnRhbCA9IF9hLmhvcml6b250YWw7XHJcbiAgICAgICAgdmFyICQ7XHJcbiAgICAgICAgaWYgKHNpYmxpbmdzSyAmJiBoZWlnaHQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRocmVzaG9sZHMuc2libGluZ3Nbc2libGluZ3NLXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aHJlc2hvbGRzLnNpYmxpbmdzW3NpYmxpbmdzS10gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF4Qm90dG9tOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heFRvcDogMCxcclxuICAgICAgICAgICAgICAgICAgICBtYXhMZWZ0OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heFJpZ2h0OiAwLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkID0gdGhpcy50aHJlc2hvbGRzLnNpYmxpbmdzW3NpYmxpbmdzS107XHJcbiAgICAgICAgICAgICQubWF4Qm90dG9tID0gaGVpZ2h0IC0gdmVydGljYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAkID0gdGhpcy50aHJlc2hvbGRzLmRyYWdnZWQ7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBXaGVuIGdvaW5nIGRvd24sIGN1cnJlbnRUb3AgaW5jcmVhc2VzICgrdmVydGljYWwpIHdpdGggZHJvcHBhYmxlXHJcbiAgICAgICAgICAgICAqIHRha2luZyBpbnRvIGNvbnNpZGVyYXRpb25zICgrIHZlcnRpY2FsKS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICQubWF4Qm90dG9tID0gdG9wICsgdmVydGljYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhbGN1bGF0ZSBtYXgtdmVydGljYWwgZm9yIHVwIGFuZCBkb3duOlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdoZW4gZ29pbmcgdXAsIGN1cnJlbnRUb3AgZGVjcmVhc2VzICgtdmVydGljYWwpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQubWF4VG9wID0gdG9wIC0gdmVydGljYWw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiBnb2luZyBsZWZ0LCBjdXJyZW50TGVmdCBkZWNyZWFzZXMgKC1ob3Jpem9udGFsKS5cclxuICAgICAgICAgKi9cclxuICAgICAgICAkLm1heExlZnQgPSBsZWZ0IC0gaG9yaXpvbnRhbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIGdvaW5nIHJpZ2h0LCBjdXJyZW50TGVmdCBpbmNyZWFzZXMgKCtob3Jpem9udGFsKSB3aXRoIGRyb3BwYWJsZVxyXG4gICAgICAgICAqIHRha2luZyBpbnRvIGNvbnNpZGVyYXRpb25zICgrIGhvcml6b250YWwpLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICQubWF4UmlnaHQgPSBsZWZ0ICsgaG9yaXpvbnRhbDtcclxuICAgIH07XHJcbiAgICBCYXNlLnByb3RvdHlwZS5pc1BhcmVuT3ZlcmZsb3dYID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwYXJlbnRCb3R0b20gPSB0aGlzLmFjdGl2ZVBhcmVudC5vZmZzZXQudG9wICsgdGhpcy5hY3RpdmVQYXJlbnQub2Zmc2V0LmhlaWdodDtcclxuICAgICAgICB2YXIgZWxlbU92ZXJmbG93WCA9IHBhcmVudEJvdHRvbSA+IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICByZXR1cm4gZWxlbU92ZXJmbG93WDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFzc2lnbnMgbmV3IEFDVElWRV9QQVJFTlQ6IHBhcmVudCB3aG8gY29udGFpbnMgZHJhZ2dlZFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBlbGVtZW50IC1cclxuICAgICAqL1xyXG4gICAgQmFzZS5wcm90b3R5cGUuYXNzaWduQWN0aXZlUGFyZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBc3NpZ24gaW5zdGFuY2UgQUNUSVZFX1BBUkVOVCB3aGljaCByZXByZXNlbnRzIGRyb3BwYWJsZS4gVGhlblxyXG4gICAgICAgICAqIGFzc2lnbiBvd25lciBwYXJlbnQgc28gd2UgaGF2ZSBmcm9tL3RvLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYWN0aXZlUGFyZW50ID0gZWxlbWVudDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBZGQgZmxhZyBmb3IgdW5kbyBtZXRob2Qgc28gd2UgY2FuIGNoZWNrIHdoaWNoICBwYXJlbnQgaXMgYmVpbmdcclxuICAgICAgICAgKiB0cmFuc2Zvcm1lZCBhbmQgd2hpY2ggaXMgbm90LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaXNPdXRBY3RpdmVQYXJlbnQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5vcHRzLnNjcm9sbC5lbmFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRzLnNjcm9sbC5lbmFibGUgPSB0aGlzLm9wdHMuc2Nyb2xsLmVuYWJsZVxyXG4gICAgICAgICAgICAgICAgPyB0aGlzLmlzUGFyZW5PdmVyZmxvd1goKVxyXG4gICAgICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEJhc2U7XHJcbn0oZHJhZ2dhYmxlXzEuQWJzdHJhY3REcmFnZ2FibGUpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gQmFzZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QmFzZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgRG5EU3RvcmVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vRG5EU3RvcmVcIikpO1xyXG52YXIgQmFzZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL0Jhc2VcIikpO1xyXG52YXIgRHJhZ2dhYmxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKERyYWdnYWJsZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIERyYWdnYWJsZShlbG1UcmVlLCBpbml0Q29vcmRpbmF0ZXMsIG9wdHMpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBlbG1UcmVlLCBpbml0Q29vcmRpbmF0ZXMsIG9wdHMpIHx8IHRoaXM7XHJcbiAgICAgICAgdmFyIHggPSBpbml0Q29vcmRpbmF0ZXMueCwgeSA9IGluaXRDb29yZGluYXRlcy55O1xyXG4gICAgICAgIF90aGlzLmlubmVyT2Zmc2V0WCA9IHggLSBfdGhpcy5kcmFnZ2VkRWxtLmN1cnJlbnRMZWZ0O1xyXG4gICAgICAgIF90aGlzLmlubmVyT2Zmc2V0WSA9IHkgLSBfdGhpcy5kcmFnZ2VkRWxtLmN1cnJlbnRUb3A7XHJcbiAgICAgICAgX3RoaXMudGVtcE9mZnNldCA9IHtcclxuICAgICAgICAgICAgY3VycmVudExlZnQ6IF90aGlzLmRyYWdnZWRFbG0uY3VycmVudExlZnQsXHJcbiAgICAgICAgICAgIGN1cnJlbnRUb3A6IF90aGlzLmRyYWdnZWRFbG0uY3VycmVudFRvcCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIF90aGlzLm9jY3VwaWVkT2Zmc2V0ID0ge1xyXG4gICAgICAgICAgICBjdXJyZW50TGVmdDogX3RoaXMuZHJhZ2dlZEVsbS5jdXJyZW50TGVmdCxcclxuICAgICAgICAgICAgY3VycmVudFRvcDogX3RoaXMuZHJhZ2dlZEVsbS5jdXJyZW50VG9wLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgX3RoaXMub2NjdXBpZWRUcmFuc2xhdGUgPSB7XHJcbiAgICAgICAgICAgIHRyYW5zbGF0ZVg6IF90aGlzLmRyYWdnZWRFbG0udHJhbnNsYXRlWCxcclxuICAgICAgICAgICAgdHJhbnNsYXRlWTogX3RoaXMuZHJhZ2dlZEVsbS50cmFuc2xhdGVZLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcHJldmlvdXMgWCBhbmQgWSBhcmUgdXNlZCB0byBjYWxjdWxhdGUgbW91c2UgZGlyZWN0aW9ucy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBfdGhpcy5wcmV2WSA9IHk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXQgY291bnRzIG51bWJlciBvZiBlbGVtZW50IHRoYXQgZHJhZ2dlZCBoYXMgcGFzc2VkLiBUaGlzIGNvdW50ZXIgaXNcclxuICAgICAgICAgKiBjcnVjaWFsIHRvIGNhbGN1bGF0ZSBkcmFnJ3MgdHJhbnNsYXRlIGFuZCBpbmRleFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIF90aGlzLm51bWJlck9mRWxlbWVudHNUcmFuc2Zvcm1lZCA9IDA7XHJcbiAgICAgICAgX3RoaXMuaXNNb3ZpbmdEb3duID0gZmFsc2U7XHJcbiAgICAgICAgX3RoaXMuaXNPdXRQb3NpdGlvbkhvcml6b250YWxseSA9IGZhbHNlO1xyXG4gICAgICAgIF90aGlzLmlzT3V0U2libGluZ3NIb3Jpem9udGFsbHkgPSBmYWxzZTtcclxuICAgICAgICB2YXIgJCA9IF90aGlzLm9wdHMucmVzdHJpY3Rpb25zO1xyXG4gICAgICAgIF90aGlzLmF4ZXNGaWx0ZXJOZWVkZWQgPVxyXG4gICAgICAgICAgICBfdGhpcy5zaWJsaW5nc0xpc3QgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICghJC5hbGxvd0xlYXZpbmdGcm9tTGVmdCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICEkLmFsbG93TGVhdmluZ0Zyb21SaWdodCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICEkLmFsbG93TGVhdmluZ0Zyb21Ub3AgfHxcclxuICAgICAgICAgICAgICAgICAgICAhJC5hbGxvd0xlYXZpbmdGcm9tQm90dG9tKTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICBEcmFnZ2FibGUucHJvdG90eXBlLmdldExhc3RFbG1JbmRleCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zaWJsaW5nc0xpc3QubGVuZ3RoIC0gMTtcclxuICAgIH07XHJcbiAgICBEcmFnZ2FibGUucHJvdG90eXBlLmlzRmlyc3RPck91dHNpZGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2libGluZ3NMaXN0ICE9PSBudWxsICYmIHRoaXMudGVtcEluZGV4IDw9IDA7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5pc0xhc3RFTG0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGVtcEluZGV4ID09PSB0aGlzLmdldExhc3RFbG1JbmRleCgpO1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuYXhlc1JpZ2h0RmlsdGVyID0gZnVuY3Rpb24gKHgsIG1pblJpZ2h0KSB7XHJcbiAgICAgICAgcmV0dXJuIHggLSB0aGlzLmlubmVyT2Zmc2V0WCArIHRoaXMuZHJhZ2dlZEVsbS5vZmZzZXQud2lkdGggPj0gbWluUmlnaHRcclxuICAgICAgICAgICAgPyAtdGhpcy5vdXRlck9mZnNldFhcclxuICAgICAgICAgICAgOiB4O1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuYXhlc0xlZnRGaWx0ZXIgPSBmdW5jdGlvbiAoeCwgbWF4TGVmdCkge1xyXG4gICAgICAgIHJldHVybiB4IC0gdGhpcy5pbm5lck9mZnNldFggPD0gbWF4TGVmdCA/IC10aGlzLm91dGVyT2Zmc2V0WCA6IHg7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5jb250YWluZXJIb3Jpem9udGFsQXhlc0ZpbHRlciA9IGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgdmFyIF9hID0gRG5EU3RvcmVfMS5kZWZhdWx0LnNpYmxpbmdzQm91bmRhcmllc1tEbkRTdG9yZV8xLmRlZmF1bHQucmVnaXN0cnlbdGhpcy5kcmFnZ2VkRWxtLmlkXS5rZXlzLnNLXSwgbWF4TGVmdCA9IF9hLm1heExlZnQsIG1pblJpZ2h0ID0gX2EubWluUmlnaHQ7XHJcbiAgICAgICAgdmFyIGZ4ID0gdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd0xlYXZpbmdGcm9tTGVmdFxyXG4gICAgICAgICAgICA/IHRoaXMub3B0cy5yZXN0cmljdGlvbnMuYWxsb3dMZWF2aW5nRnJvbVJpZ2h0XHJcbiAgICAgICAgICAgICAgICA/IHhcclxuICAgICAgICAgICAgICAgIDogdGhpcy5heGVzUmlnaHRGaWx0ZXIoeCwgbWluUmlnaHQpXHJcbiAgICAgICAgICAgIDogdGhpcy5heGVzTGVmdEZpbHRlcih4LCBtYXhMZWZ0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRzLnJlc3RyaWN0aW9ucy5hbGxvd0xlYXZpbmdGcm9tUmlnaHRcclxuICAgICAgICAgICAgPyBmeFxyXG4gICAgICAgICAgICA6IHRoaXMuYXhlc1JpZ2h0RmlsdGVyKGZ4LCBtaW5SaWdodCk7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5heGVzQm90dG9tRmlsdGVyID0gZnVuY3Rpb24gKHksIGJvdHRvbSkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy50ZW1wSW5kZXggPCAwIHx8IHRoaXMuaXNMYXN0RUxtKCkpICYmXHJcbiAgICAgICAgICAgIHkgLSB0aGlzLmlubmVyT2Zmc2V0WSArIHRoaXMuZHJhZ2dlZEVsbS5vZmZzZXQuaGVpZ2h0ID49IGJvdHRvbVxyXG4gICAgICAgICAgICA/IGJvdHRvbSArIHRoaXMuaW5uZXJPZmZzZXRZIC0gdGhpcy5kcmFnZ2VkRWxtLm9mZnNldC5oZWlnaHRcclxuICAgICAgICAgICAgOiB5O1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuYXhlc1RvcEZpbHRlciA9IGZ1bmN0aW9uICh5LCBtYXhUb3ApIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZW1wSW5kZXggPD0gMCAmJiB5IC0gdGhpcy5pbm5lck9mZnNldFkgPD0gbWF4VG9wXHJcbiAgICAgICAgICAgID8gbWF4VG9wICsgdGhpcy5pbm5lck9mZnNldFlcclxuICAgICAgICAgICAgOiB5O1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuY29udGFpbmVyVmVydGljYWxBeGVzRmlsdGVyID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgX2EgPSBEbkRTdG9yZV8xLmRlZmF1bHQuc2libGluZ3NCb3VuZGFyaWVzW0RuRFN0b3JlXzEuZGVmYXVsdC5yZWdpc3RyeVt0aGlzLmRyYWdnZWRFbG0uaWRdLmtleXMuc0tdLCB0b3AgPSBfYS50b3AsIGJvdHRvbSA9IF9hLmJvdHRvbTtcclxuICAgICAgICB2YXIgZnkgPSB0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93TGVhdmluZ0Zyb21Ub3BcclxuICAgICAgICAgICAgPyB0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93TGVhdmluZ0Zyb21Cb3R0b21cclxuICAgICAgICAgICAgICAgID8geVxyXG4gICAgICAgICAgICAgICAgOiB0aGlzLmF4ZXNCb3R0b21GaWx0ZXIoeSwgYm90dG9tKVxyXG4gICAgICAgICAgICA6IHRoaXMuYXhlc1RvcEZpbHRlcih5LCB0b3ApO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdHMucmVzdHJpY3Rpb25zLmFsbG93TGVhdmluZ0Zyb21Cb3R0b21cclxuICAgICAgICAgICAgPyBmeVxyXG4gICAgICAgICAgICA6IHRoaXMuYXhlc0JvdHRvbUZpbHRlcihmeSwgYm90dG9tKTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIERyYWdnZWQgY3VycmVudC1vZmZzZXQgaXMgZXNzZW50aWFsIHRvIGRldGVybWluZSBkcmFnZ2VkIHBvc2l0aW9uIGluXHJcbiAgICAgKiBsYXlvdXQgYW5kIHBhcmVudC5cclxuICAgICAqXHJcbiAgICAgKiBJcyBpdCBtb3ZlZCBmb3JtIGl0cyB0cmFuc2xhdGU/IElzIGl0IG91dCB0aGUgcGFyZW50IG9yIGluXHJcbiAgICAgKiBhbm90aGVyIHBhcmVudD8gVGhlIGFuc3dlciBpcyByZWxhdGVkIHRvIGN1cnJlbnRPZmZzZXQuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZTogdGhlc2UgYXJlIHRoZSBjdXJyZW50IG9mZnNldCByZWxhdGVkIG9ubHkgdG8gdGhlIGRyYWdnaW5nLiBXaGVuIHRoZVxyXG4gICAgICogb3BlcmF0aW9uIGlzIGRvbmUsIGRpZmZlcmVudCBjYWxjdWxhdGlvbiB3aWxsIGJlIHNldC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCAtXHJcbiAgICAgKiBAcGFyYW0geSAtXHJcbiAgICAgKi9cclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuZHJhZ0F0ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICB2YXIgZmlsdGVyZWRZID0geTtcclxuICAgICAgICB2YXIgZmlsdGVyZWRYID0geDtcclxuICAgICAgICBpZiAodGhpcy5heGVzRmlsdGVyTmVlZGVkKSB7XHJcbiAgICAgICAgICAgIGZpbHRlcmVkWSA9IHRoaXMuY29udGFpbmVyVmVydGljYWxBeGVzRmlsdGVyKHkpO1xyXG4gICAgICAgICAgICBmaWx0ZXJlZFggPSB0aGlzLmNvbnRhaW5lckhvcml6b250YWxBeGVzRmlsdGVyKHgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZShmaWx0ZXJlZFgsIGZpbHRlcmVkWSk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRXZlcnkgdGltZSB3ZSBnb3QgbmV3IHRyYW5zbGF0ZSwgb2Zmc2V0IHNob3VsZCBiZSB1cGRhdGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZW1wT2Zmc2V0LmN1cnJlbnRMZWZ0ID0gZmlsdGVyZWRYIC0gdGhpcy5pbm5lck9mZnNldFg7XHJcbiAgICAgICAgdGhpcy50ZW1wT2Zmc2V0LmN1cnJlbnRUb3AgPSBmaWx0ZXJlZFkgLSB0aGlzLmlubmVyT2Zmc2V0WTtcclxuICAgIH07XHJcbiAgICBEcmFnZ2FibGUucHJvdG90eXBlLmlzT3V0VGhyZXNob2xkSCA9IGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnRlbXBPZmZzZXQuY3VycmVudExlZnQgPCAkLm1heExlZnQgfHxcclxuICAgICAgICAgICAgdGhpcy50ZW1wT2Zmc2V0LmN1cnJlbnRMZWZ0ID4gJC5tYXhSaWdodCk7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5pc091dFBvc2l0aW9uViA9IGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNNb3ZpbmdEb3duXHJcbiAgICAgICAgICAgID8gdGhpcy50ZW1wT2Zmc2V0LmN1cnJlbnRUb3AgPiAkLm1heEJvdHRvbVxyXG4gICAgICAgICAgICA6IHRoaXMudGVtcE9mZnNldC5jdXJyZW50VG9wIDwgJC5tYXhUb3A7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5pc091dENvbnRhaW5lclYgPSBmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFyZSB5b3UgbGFzdCBlbGVtZW50IGFuZCBvdXRzaWRlIHRoZSBjb250YWluZXI/IE9yIGFyZSB5b3UgY29taW5nIGZyb20gdG9wXHJcbiAgICAgICAgICogYW5kIG91dHNpZGUgdGhlIGNvbnRhaW5lcj9cclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gKCh0aGlzLmlzTGFzdEVMbSgpICYmIHRoaXMudGVtcE9mZnNldC5jdXJyZW50VG9wID4gJC5tYXhCb3R0b20pIHx8XHJcbiAgICAgICAgICAgICh0aGlzLnRlbXBJbmRleCA8IDAgJiYgdGhpcy50ZW1wT2Zmc2V0LmN1cnJlbnRUb3AgPCAkLm1heFRvcCkpO1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuaXNPdXRQb3NpdGlvbiA9IGZ1bmN0aW9uICgkKSB7XHJcbiAgICAgICAgdGhpcy5pc091dFBvc2l0aW9uSG9yaXpvbnRhbGx5ID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPdXRUaHJlc2hvbGRIKCQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNPdXRQb3NpdGlvbkhvcml6b250YWxseSA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc091dFBvc2l0aW9uVigkKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuaXNPdXRDb250YWluZXIgPSBmdW5jdGlvbiAoJCkge1xyXG4gICAgICAgIHRoaXMuaXNPdXRTaWJsaW5nc0hvcml6b250YWxseSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzT3V0Q29udGFpbmVyVigkKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzT3V0U2libGluZ3NIb3Jpem9udGFsbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPdXRUaHJlc2hvbGRIKCQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgZHJhZ2dlZCBpdCBvdXQgb2YgaXRzIHBvc2l0aW9uIG9yIHBhcmVudC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc2libGluZ3NLIC1cclxuICAgICAqL1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5pc091dFRocmVzaG9sZCA9IGZ1bmN0aW9uIChzaWJsaW5nc0spIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLnRocmVzaG9sZHMsIHNpYmxpbmdzID0gX2Euc2libGluZ3MsIGRyYWdnZWQgPSBfYS5kcmFnZ2VkO1xyXG4gICAgICAgIHJldHVybiBzaWJsaW5nc0tcclxuICAgICAgICAgICAgPyB0aGlzLmlzT3V0Q29udGFpbmVyKHNpYmxpbmdzW3NpYmxpbmdzS10pXHJcbiAgICAgICAgICAgIDogdGhpcy5pc091dFBvc2l0aW9uKGRyYWdnZWQpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIGRyYWdnZWQgaXMgdGhlIGZpcnN0IGNoaWxkIGFuZCBnb2luZyB1cC5cclxuICAgICAqL1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5pc0xlYXZpbmdGcm9tVG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5pc0ZpcnN0T3JPdXRzaWRlKCkgJiZcclxuICAgICAgICAgICAgIXRoaXMuaXNPdXRTaWJsaW5nc0hvcml6b250YWxseSAmJlxyXG4gICAgICAgICAgICAhdGhpcy5pc01vdmluZ0Rvd24pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIGRyYWdnZWQgaXMgdGhlIGxhc3QgY2hpbGQgYW5kIGdvaW5nIGRvd24uXHJcbiAgICAgKi9cclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuaXNMZWF2aW5nRnJvbUJvdHRvbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc0sgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtQnlJZCh0aGlzLmRyYWdnZWRFbG0uaWQpLmtleXMuc0s7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmlzTGFzdEVMbSgpICYmXHJcbiAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmdEb3duICYmXHJcbiAgICAgICAgICAgIHRoaXMuaXNPdXRDb250YWluZXJWKHRoaXMudGhyZXNob2xkcy5zaWJsaW5nc1tzS10pKTtcclxuICAgIH07XHJcbiAgICBEcmFnZ2FibGUucHJvdG90eXBlLmlzTm90U2V0dGxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc0sgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtQnlJZCh0aGlzLmRyYWdnZWRFbG0uaWQpLmtleXMuc0s7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnNpYmxpbmdzTGlzdCAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAhdGhpcy5pc0xlYXZpbmdGcm9tQm90dG9tKCkgJiZcclxuICAgICAgICAgICAgKHRoaXMuaXNPdXRUaHJlc2hvbGQoKSB8fCB0aGlzLmlzT3V0VGhyZXNob2xkKHNLKSkpO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHkgLVxyXG4gICAgICovXHJcbiAgICBEcmFnZ2FibGUucHJvdG90eXBlLnNldERyYWdnZWRNb3ZpbmdEb3duID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICBpZiAodGhpcy5wcmV2WSA9PT0geSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNNb3ZpbmdEb3duID0geSA+IHRoaXMucHJldlk7XHJcbiAgICAgICAgdGhpcy5wcmV2WSA9IHk7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5pbmNOdW1PZkVsZW1lbnRzVHJhbnNmb3JtZWQgPSBmdW5jdGlvbiAoZWZmZWN0ZWRFbGVtRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5udW1iZXJPZkVsZW1lbnRzVHJhbnNmb3JtZWQgKz0gLTEgKiBlZmZlY3RlZEVsZW1EaXJlY3Rpb247XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5oYXNNb3ZlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuZHJhZ2dlZEVsbS50cmFuc2xhdGVYICE9PSB0aGlzLnRlbXBUcmFuc2xhdGUueCB8fFxyXG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRFbG0udHJhbnNsYXRlWSAhPT0gdGhpcy50ZW1wVHJhbnNsYXRlLnkpO1xyXG4gICAgfTtcclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuc2V0RHJhZ2dlZFBvc2l0aW9uID0gZnVuY3Rpb24gKGlzRmFsbGJhY2spIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbiB0aGlzIGNhc2UsIHRoZSB1c2UgY2xpY2tlZCB3aXRob3V0IG1ha2luZyBhbnkgbW92ZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaXNGYWxsYmFjayB8fFxyXG4gICAgICAgICAgICB0aGlzLnNpYmxpbmdzTGlzdCA9PT0gbnVsbCB8fFxyXG4gICAgICAgICAgICB0aGlzLm51bWJlck9mRWxlbWVudHNUcmFuc2Zvcm1lZCA9PT0gMFxyXG4gICAgICAgIC8vIHRoaXMuaXNOb3RTZXR0bGVkKClcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIG5vdCBpc0RyYWdnZWRPdXRQb3NpdGlvbiwgaXQgbWVhbnMgZHJhZ2dlZCBpcyBvdXQgaXRzIHBvc2l0aW9uLCBpbnNpZGVcclxuICAgICAgICAgICAgICogbGlzdCBidXQgZGlkbid0IHJlYWNoIGFub3RoZXIgZWxlbWVudCB0byByZXBsYWNlLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBMaXN0J3MgZWxlbWVudHMgaXMgaW4gdGhlaXIgcG9zaXRpb24sIGp1c3QgdW5kbyBkcmFnZ2VkLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBSZXN0b3JlIGRyYWdnZWQgcG9zaXRpb24gKHRyYW5zbGF0ZVgsIHRyYW5zbGF0ZVkpIGRpcmVjdGx5LiBXaHk/IEJlY2F1c2UsXHJcbiAgICAgICAgICAgICAqIGRyYWdnZWQgZGVwZW5kcyBvbiBleHRyYSBpbnN0YW5jZSB0byBmbG9hdCBpbiBsYXlvdXQgdGhhdCBpcyBub3QgcmVsYXRlZCB0byBlbGVtZW50XHJcbiAgICAgICAgICAgICAqIGluc3RhbmNlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTW92ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2VkRWxtLnRyYW5zZm9ybUVsbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2libGluZ3NMaXN0ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaWJsaW5nc0xpc3RbdGhpcy5kcmFnZ2VkRWxtLm9yZGVyLnNlbGZdICE9PSB0aGlzLmRyYWdnZWRFbG0uaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnZWRFbG0uYXNzaWduTmV3UG9zaXRpb24odGhpcy5zaWJsaW5nc0xpc3QsIHRoaXMuZHJhZ2dlZEVsbS5vcmRlci5zZWxmKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhZ2dlZEVsbS5jdXJyZW50VG9wID0gdGhpcy5vY2N1cGllZE9mZnNldC5jdXJyZW50VG9wO1xyXG4gICAgICAgIHRoaXMuZHJhZ2dlZEVsbS5jdXJyZW50TGVmdCA9IHRoaXMub2NjdXBpZWRPZmZzZXQuY3VycmVudExlZnQ7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2VkRWxtLnRyYW5zbGF0ZVggPSB0aGlzLm9jY3VwaWVkVHJhbnNsYXRlLnRyYW5zbGF0ZVg7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2VkRWxtLnRyYW5zbGF0ZVkgPSB0aGlzLm9jY3VwaWVkVHJhbnNsYXRlLnRyYW5zbGF0ZVk7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2VkRWxtLnRyYW5zZm9ybUVsbSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnNpYmxpbmdzTGlzdCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRFbG0uYXNzaWduTmV3UG9zaXRpb24odGhpcy5zaWJsaW5nc0xpc3QsIHRoaXMudGVtcEluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcmFnZ2VkRWxtLm9yZGVyLnNlbGYgPSB0aGlzLnRlbXBJbmRleDtcclxuICAgIH07XHJcbiAgICBEcmFnZ2FibGUucHJvdG90eXBlLmVuZERyYWdnaW5nID0gZnVuY3Rpb24gKGlzRmFsbGJhY2spIHtcclxuICAgICAgICB0aGlzLnNldERyYWdnZWQoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuc2V0RHJhZ2dlZFBvc2l0aW9uKGlzRmFsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEcmFnZ2FibGU7XHJcbn0oQmFzZV8xLmRlZmF1bHQpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRHJhZ2dhYmxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1EcmFnZ2FibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gdm9pZCAwO1xyXG52YXIgRHJhZ2dhYmxlXzEgPSByZXF1aXJlKFwiLi9EcmFnZ2FibGVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9faW1wb3J0RGVmYXVsdChEcmFnZ2FibGVfMSkuZGVmYXVsdDsgfSB9KTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIERuRFN0b3JlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL0RuRFN0b3JlXCIpKTtcclxuLyoqXHJcbiAqIENsYXNzIGluY2x1ZGVzIGFsbCB0cmFuc2Zvcm1hdGlvbiBtZXRob2RzIHJlbGF0ZWQgdG8gZHJvcHBhYmxlLlxyXG4gKi9cclxudmFyIERyb3BwYWJsZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIERyb3BwYWJsZShkcmFnZ2FibGUpIHtcclxuICAgICAgICB0aGlzLmRyYWdnYWJsZSA9IGRyYWdnYWJsZTtcclxuICAgICAgICB0aGlzLmVsbVRyYW5zaXRpb25ZID0gMDtcclxuICAgICAgICB0aGlzLmRyYWdnZWRBY2N1bXVsYXRlZFRyYW5zaXRpb25ZID0gMDtcclxuICAgICAgICB0aGlzLmRyYWdnZWRZT2Zmc2V0ID0gMDtcclxuICAgICAgICB0aGlzLmxlZnREaWZmZXJlbmNlID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFbGVtZW50cyBlZmZlY3RlZCBieSBkcmFnZ2VkIGRpcmVjdGlvbi5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmVmZmVjdGVkRWxlbURpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgdGhpcy5pc0xpc3RMb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxlZnRBdEluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMYXN0RWxtT2Zmc2V0KCk7XHJcbiAgICAgICAgdGhpcy5zaWJsaW5nc0VtcHR5RWxtSW5kZXggPSAtMTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyB0aGUgdGVtcG9yYXJ5IGluZGV4IG9mIGRyYWdnZWQgYmVmb3JlIGl0IG9jY3VwaWVzIG5ldyBwb3NpdGlvbi5cclxuICAgICAqL1xyXG4gICAgRHJvcHBhYmxlLnByb3RvdHlwZS5nZXREcmFnZ2VkVGVtcEluZGV4ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRyYWdnYWJsZS50ZW1wSW5kZXg7XHJcbiAgICB9O1xyXG4gICAgRHJvcHBhYmxlLnByb3RvdHlwZS5zZXRFZmZlY3RlZEVsZW1EaXJlY3Rpb24gPSBmdW5jdGlvbiAoaXNVcCkge1xyXG4gICAgICAgIHRoaXMuZWZmZWN0ZWRFbGVtRGlyZWN0aW9uID0gaXNVcCA/IC0xIDogMTtcclxuICAgIH07XHJcbiAgICBEcm9wcGFibGUucHJvdG90eXBlLnVwZGF0ZUxhc3RFbG1PZmZzZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRUb3AgPSAwO1xyXG4gICAgICAgIHZhciBjdXJyZW50TGVmdCA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdCkge1xyXG4gICAgICAgICAgICB2YXIgbGFzdEluZGV4ID0gdGhpcy5kcmFnZ2FibGUuc2libGluZ3NMaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdFtsYXN0SW5kZXhdO1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBXaGF0IGNhdXNlcyB0aGlzPyBOZWVkIGludmVzdGlnYXRpb24uXHJcbiAgICAgICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtQnlJZChpZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoY3VycmVudFRvcCA9IGVsZW1lbnQuY3VycmVudFRvcCwgY3VycmVudExlZnQgPSBlbGVtZW50LmN1cnJlbnRMZWZ0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByZXNlcnZlTGFzdEVsbU9mZnNldCA9IHtcclxuICAgICAgICAgICAgY3VycmVudExlZnQ6IGN1cnJlbnRMZWZ0LFxyXG4gICAgICAgICAgICBjdXJyZW50VG9wOiBjdXJyZW50VG9wLFxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgRHJvcHBhYmxlLnByb3RvdHlwZS51cGRhdGVPY2N1cGllZE9mZnNldCA9IGZ1bmN0aW9uIChlbG1Ub3AsIGVsbUxlZnQpIHtcclxuICAgICAgICB0aGlzLmRyYWdnYWJsZS5vY2N1cGllZE9mZnNldC5jdXJyZW50VG9wID0gZWxtVG9wICsgdGhpcy5kcmFnZ2VkWU9mZnNldDtcclxuICAgICAgICB0aGlzLmRyYWdnYWJsZS5vY2N1cGllZE9mZnNldC5jdXJyZW50TGVmdCA9IGVsbUxlZnQ7XHJcbiAgICB9O1xyXG4gICAgRHJvcHBhYmxlLnByb3RvdHlwZS51cGRhdGVPY2N1cGllZFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIChkaXJlY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmRyYWdnYWJsZS5vY2N1cGllZFRyYW5zbGF0ZS50cmFuc2xhdGVZICs9XHJcbiAgICAgICAgICAgIGRpcmVjdGlvbiAqIHRoaXMuZHJhZ2dlZEFjY3VtdWxhdGVkVHJhbnNpdGlvblk7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2FibGUub2NjdXBpZWRUcmFuc2xhdGUudHJhbnNsYXRlWCArPSAwO1xyXG4gICAgfTtcclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuY2FsY3VsYXRlWURpc3RhbmNlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICB2YXIgZWxtTGVmdCA9IGVsZW1lbnQuY3VycmVudExlZnQsIGVsbVRvcCA9IGVsZW1lbnQuY3VycmVudFRvcCwgZWxtSGlnaHQgPSBlbGVtZW50Lm9mZnNldC5oZWlnaHQ7XHJcbiAgICAgICAgdmFyIF9hID0gdGhpcy5kcmFnZ2FibGUsIF9iID0gX2Eub2NjdXBpZWRPZmZzZXQsIGRyYWdnZWRMZWZ0ID0gX2IuY3VycmVudExlZnQsIGRyYWdnZWRUb3AgPSBfYi5jdXJyZW50VG9wLCBkcmFnZ2VkSGlnaHQgPSBfYS5kcmFnZ2VkRWxtLm9mZnNldC5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2VkWU9mZnNldCA9IDA7XHJcbiAgICAgICAgdGhpcy5lbG1UcmFuc2l0aW9uWSA9IDA7XHJcbiAgICAgICAgdGhpcy5sZWZ0RGlmZmVyZW5jZSA9IE1hdGguYWJzKGVsbUxlZnQgLSBkcmFnZ2VkTGVmdCk7XHJcbiAgICAgICAgdmFyIHRvcERpZmZlcmVuY2UgPSBNYXRoLmFicyhlbG1Ub3AgLSBkcmFnZ2VkVG9wKTtcclxuICAgICAgICB0aGlzLmRyYWdnZWRBY2N1bXVsYXRlZFRyYW5zaXRpb25ZID0gdG9wRGlmZmVyZW5jZTtcclxuICAgICAgICB0aGlzLmVsbVRyYW5zaXRpb25ZID0gdG9wRGlmZmVyZW5jZTtcclxuICAgICAgICB2YXIgaGVpZ2h0T2Zmc2V0ID0gTWF0aC5hYnMoZHJhZ2dlZEhpZ2h0IC0gZWxtSGlnaHQpO1xyXG4gICAgICAgIGlmIChoZWlnaHRPZmZzZXQgPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAoZHJhZ2dlZEhpZ2h0IDwgZWxtSGlnaHQpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbG1IaWdodCBpcyBiaWdnZXJcIik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVmZmVjdGVkRWxlbURpcmVjdGlvbiA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZWxtIGdvaW5nIHVwXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2VkQWNjdW11bGF0ZWRUcmFuc2l0aW9uWSArPSBoZWlnaHRPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnZWRZT2Zmc2V0ID0gaGVpZ2h0T2Zmc2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbG0gZ29pbmcgZG93blwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxtVHJhbnNpdGlvblkgLT0gaGVpZ2h0T2Zmc2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbG1IaWdodCBpcyBzbWFsbGVyXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLmVmZmVjdGVkRWxlbURpcmVjdGlvbiA9PT0gLTEpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbG0gZ29pbmcgdXBcIik7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZEFjY3VtdWxhdGVkVHJhbnNpdGlvblkgLT0gaGVpZ2h0T2Zmc2V0O1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRZT2Zmc2V0ID0gLWhlaWdodE9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZWxtIGdvaW5nIGRvd25cIik7XHJcbiAgICAgICAgICAgIHRoaXMuZWxtVHJhbnNpdGlvblkgKz0gaGVpZ2h0T2Zmc2V0O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZXMgZWxlbWVudCBpbnN0YW5jZSBhbmQgY2FsY3VsYXRlcyB0aGUgcmVxdWlyZWQgdHJhbnNmb3JtIGRpc3RhbmNlLiBJdFxyXG4gICAgICogaW52b2tlcyBmb3IgZWFjaCBlbGlnaWJsZSBlbGVtZW50IGluIHRoZSBwYXJlbnQgY29udGFpbmVyLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpZCAtXHJcbiAgICAgKi9cclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChpZCwgaXNVcGRhdGVEcmFnZ2VkVHJhbnNsYXRlLCBkcmFnZ2VkRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtQnlJZChpZCk7XHJcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVZRGlzdGFuY2UoZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2FibGUuaW5jTnVtT2ZFbGVtZW50c1RyYW5zZm9ybWVkKHRoaXMuZWZmZWN0ZWRFbGVtRGlyZWN0aW9uKTtcclxuICAgICAgICAvLyBUT0RPOiBhbHdheXMgdHJ1ZSBmb3IgdGhlIGZpcnN0IGVsZW1lbnRcclxuICAgICAgICBpZiAoIXRoaXMuaXNMaXN0TG9ja2VkKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBCeSB1cGRhdGluZyB0aGUgZHJhZ2dlZCB0cmFuc2xhdGUsIHdlIGd1YXJhbnRlZSB0aGF0IGRyYWdnZWRcclxuICAgICAgICAgICAgICogdHJhbnNmb3JtYXRpb24gd2lsbCBub3QgdHJpZ2dlcmVkIHVudGlsIGRyYWdnZWQgaXMgb3ZlciB0aHJlc2hvbGRcclxuICAgICAgICAgICAgICogd2hpY2ggd2lsbCBiZSBkZXRlY3RlZCBieSBpc0RyYWdnZWRPdXRQb3NpdGlvbi5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogSG93ZXZlciwgdGhpcyBpcyBvbmx5IGVmZmVjdGl2ZSB3aGVuIGRyYWdnZWQgaXMgZml0IGluIGl0cyBuZXdcclxuICAgICAgICAgICAgICogdHJhbnNsYXRlLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBBbmQgd2UgaGF2ZSBuZXcgdHJhbnNsYXRlIG9ubHkgb25jZS4gVGhlIGZpcnN0IGVsZW1lbnQgbWF0Y2hlZCB0aGVcclxuICAgICAgICAgICAgICogY29uZGl0aW9uIGlzIHRoZSBicmVha2luZyBwb2ludCBlbGVtZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGUuc2V0VGhyZXNob2xkKGVsZW1lbnQuY3VycmVudFRvcCwgZWxlbWVudC5jdXJyZW50TGVmdCwgZWxlbWVudC5vZmZzZXQuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZWxlbWVudC5vbkRyYWdPdmVyKCk7XHJcbiAgICAgICAgdmFyIGVsbUxlZnQgPSBlbGVtZW50LmN1cnJlbnRMZWZ0LCBlbG1Ub3AgPSBlbGVtZW50LmN1cnJlbnRUb3A7XHJcbiAgICAgICAgdGhpcy51cGRhdGVPY2N1cGllZE9mZnNldChlbG1Ub3AsIGVsbUxlZnQpO1xyXG4gICAgICAgIGlmIChpc1VwZGF0ZURyYWdnZWRUcmFuc2xhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVPY2N1cGllZFRyYW5zbGF0ZShkcmFnZ2VkRGlyZWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RhcnQgdHJhbnNmb3JtaW5nIHByb2Nlc3NcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNpYmxpbmdzRW1wdHlFbG1JbmRleCA9IGVsZW1lbnQuc2V0WVBvc2l0aW9uKHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdCwgdGhpcy5lZmZlY3RlZEVsZW1EaXJlY3Rpb24sIHRoaXMuZWxtVHJhbnNpdGlvblksIHRoaXMuZHJhZ2dhYmxlLm9wZXJhdGlvbklELCB0aGlzLnNpYmxpbmdzRW1wdHlFbG1JbmRleCk7XHJcbiAgICAgICAgLy8gZWxlbWVudC5vbkRyYWdMZWF2ZSgpO1xyXG4gICAgfTtcclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuaXNFbGVtQWJvdmVEcmFnZ2VkID0gZnVuY3Rpb24gKGVsbUN1cnJlbnRPZmZzZXRUb3ApIHtcclxuICAgICAgICByZXR1cm4gZWxtQ3VycmVudE9mZnNldFRvcCA8IHRoaXMuZHJhZ2dhYmxlLnRlbXBPZmZzZXQuY3VycmVudFRvcDtcclxuICAgIH07XHJcbiAgICBEcm9wcGFibGUucHJvdG90eXBlLmNoZWNrSWZEcmFnZ2VkSXNMYXN0RWxtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpc0xhc3QgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5kcmFnZ2FibGUuc2libGluZ3NMaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdFtpXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJREVsaWdpYmxlMk1vdmUoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IERuRFN0b3JlXzEuZGVmYXVsdC5nZXRFbG1CeUlkKGlkKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VG9wID0gZWxlbWVudC5jdXJyZW50VG9wO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzUXVhbGlmaWVkID0gdGhpcy5pc0VsZW1BYm92ZURyYWdnZWQoY3VycmVudFRvcCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNRdWFsaWZpZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpc0xhc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIFVwZGF0ZSB0aHJlc2hvbGQgZnJvbSBoZXJlIHNpbmNlIHRoZXJlJ3Mgbm8gY2FsbGluZyB0byB1cGRhdGVFbGVtZW50LlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlLnNldFRocmVzaG9sZCh0aGlzLnByZXNlcnZlTGFzdEVsbU9mZnNldC5jdXJyZW50VG9wLCB0aGlzLnByZXNlcnZlTGFzdEVsbU9mZnNldC5jdXJyZW50TGVmdCwgZWxlbWVudC5vZmZzZXQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU9jY3VwaWVkT2Zmc2V0KHRoaXMucHJlc2VydmVMYXN0RWxtT2Zmc2V0LmN1cnJlbnRUb3AsIHRoaXMucHJlc2VydmVMYXN0RWxtT2Zmc2V0LmN1cnJlbnRMZWZ0KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpc0xhc3Q7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wYXJlcyB0aGUgZHJhZ2dlZCBvZmZzZXQgd2l0aCBlbGVtZW50IG9mZnNldCBhbmQgcmV0dXJuc1xyXG4gICAgICogdHJ1ZSBpZiBlbGVtZW50IGlzIG1hdGNoZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVsbUN1cnJlbnRPZmZzZXRUb3AgLVxyXG4gICAgICovXHJcbiAgICBEcm9wcGFibGUucHJvdG90eXBlLmlzRWxlbVVuZGVyRHJhZ2dlZCA9IGZ1bmN0aW9uIChlbG1DdXJyZW50T2Zmc2V0VG9wKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRWxlbWVudCBpcyBTd2l0Y2hhYmxlIHdoZW4gaXQncyB1bmRlciBkcmFnZ2VkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBlbG1DdXJyZW50T2Zmc2V0VG9wID4gdGhpcy5kcmFnZ2FibGUudGVtcE9mZnNldC5jdXJyZW50VG9wO1xyXG4gICAgfTtcclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuZGV0ZWN0RHJvcHBhYmxlSW5kZXggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRyb3BwYWJsZUluZGV4ID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmRyYWdnYWJsZS5zaWJsaW5nc0xpc3RbaV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSURFbGlnaWJsZTJNb3ZlKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtQnlJZChpZCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRvcCA9IGVsZW1lbnQuY3VycmVudFRvcDtcclxuICAgICAgICAgICAgICAgIHZhciBpc1F1YWxpZmllZCA9IHRoaXMuaXNFbGVtVW5kZXJEcmFnZ2VkKGN1cnJlbnRUb3ApO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUXVhbGlmaWVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJvcHBhYmxlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkcm9wcGFibGVJbmRleDtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaWQgLVxyXG4gICAgICovXHJcbiAgICBEcm9wcGFibGUucHJvdG90eXBlLmlzSURFbGlnaWJsZTJNb3ZlID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGlkICYmIGlkICE9PSB0aGlzLmRyYWdnYWJsZS5kcmFnZ2VkRWxtLmlkO1xyXG4gICAgfTtcclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuc3dpdGNoRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZWxtSW5kZXggPSB0aGlzLmRyYWdnYWJsZS50ZW1wSW5kZXggKyAtMSAqIHRoaXMuZWZmZWN0ZWRFbGVtRGlyZWN0aW9uO1xyXG4gICAgICAgIHZhciBpZCA9IHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdFtlbG1JbmRleF07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJREVsaWdpYmxlMk1vdmUoaWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlLnRlbXBJbmRleCA9IGVsbUluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoaWQsIHRydWUsIHRoaXMuZWZmZWN0ZWRFbGVtRGlyZWN0aW9uID09PSAtMSA/IDEgOiAtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUubGlmdFVwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBmcm9tID0gdGhpcy5kcmFnZ2FibGUudGVtcEluZGV4ICsgMTtcclxuICAgICAgICB0aGlzLmxlZnRBdEluZGV4ID0gdGhpcy5kcmFnZ2FibGUudGVtcEluZGV4O1xyXG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlLnRlbXBJbmRleCA9IC0xO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBmcm9tOyBpIDwgdGhpcy5kcmFnZ2FibGUuc2libGluZ3NMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEb24ndCB1cGRhdGUgdHJhbnNsYXRlIGJlY2F1c2UgaXQncyBub3QgcGVybWFuZW50LiBSZWxlYXNpbmcgZHJhZ2dlZFxyXG4gICAgICAgICAgICAgKiBtZWFucyB1bmRvaW5nIGxhc3QgcG9zaXRpb24uXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmRyYWdnYWJsZS5zaWJsaW5nc0xpc3RbaV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSURFbGlnaWJsZTJNb3ZlKGlkKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGlkLCB0cnVlLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdG8gLSBpbmRleFxyXG4gICAgICovXHJcbiAgICBEcm9wcGFibGUucHJvdG90eXBlLm1vdmVEb3duID0gZnVuY3Rpb24gKHRvKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdC5sZW5ndGggLSAxOyBpID49IHRvOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5kcmFnZ2FibGUuc2libGluZ3NMaXN0W2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0lERWxpZ2libGUyTW92ZShpZCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudChpZCwgdHJ1ZSwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuZHJhZ2dlZE91dFBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZS5pc0xlYXZpbmdGcm9tVG9wKCkpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIElmIGxlYXZpbmcgYW5kIHBhcmVudCBsb2NrZWQsIGRvIG5vdGhpbmcuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyBtb3ZlIGVsZW1lbnQgdXBcclxuICAgICAgICAgICAgdGhpcy5zZXRFZmZlY3RlZEVsZW1EaXJlY3Rpb24odHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIGxvY2sgdGhlIHBhcmVudFxyXG4gICAgICAgICAgICB0aGlzLmlzTGlzdExvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubGlmdFVwKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlLmlzTGVhdmluZ0Zyb21Cb3R0b20oKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTGlzdExvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTGlzdExvY2tlZCkge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogbm9ybWFsIG1vdmVtZW50IGluc2lkZSB0aGUgcGFyZW50XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogR29pbmcgb3V0IGZyb20gdGhlIGxpc3Q6IFJpZ2h0L2xlZnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGUuaXNPdXRQb3NpdGlvbkhvcml6b250YWxseSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSXMgaXMgb3V0IHBhcmVudD9cclxuICAgICAgICAgICAgICAgIC8vIG1vdmUgZWxlbWVudCB1cFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZmZlY3RlZEVsZW1EaXJlY3Rpb24odHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBsb2NrIHRoZSBwYXJlbnRcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNMaXN0TG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMubGlmdFVwKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5vcm1hbCBzdGF0ZSwgc3dpdGNoLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgLy8gaW5zaWRlIHRoZSBsaXN0LCBlZmZlY3RlZCBzaG91bGQgYmUgcmVsYXRlZCB0byBtb3VzZSBtb3ZlbWVudFxyXG4gICAgICAgICAgICB0aGlzLnNldEVmZmVjdGVkRWxlbURpcmVjdGlvbih0aGlzLmRyYWdnYWJsZS5pc01vdmluZ0Rvd24pO1xyXG4gICAgICAgICAgICB0aGlzLnN3aXRjaEVsZW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgRHJvcHBhYmxlLnByb3RvdHlwZS51bmxvY2tQYXJlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xpc3RMb2NrZWQgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geSAtXHJcbiAgICAgKi9cclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuZHJhZ2dlZElzQ29taW5nSW4gPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElmIHRlbXBJbmRleCBpcyB6ZXJvLCB0aGUgZHJhZ2dlZCBpcyBjb21pbmcgZnJvbSB0aGUgdG9wLiBTbywgbW92ZSB0aGVtXHJcbiAgICAgICAgICogZG93biBhbGw6IHRvPTBcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgdG8gPSAwO1xyXG4gICAgICAgIHZhciBoYXNUb01vdmVTaWJsaW5nc0Rvd24gPSB0cnVlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE90aGVyd2lzZSwgZGV0ZWN0IHdoZXJlIGl0IGNvbWluZyBmcm9tIGFuZCB1cGRhdGUgdGVtcEluZGV4XHJcbiAgICAgICAgICogYWNjb3JkaW5nbHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlLnRlbXBJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0byA9IHRoaXMuZGV0ZWN0RHJvcHBhYmxlSW5kZXgoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0byAhPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQncyB0aGUgbGFzdCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2hlY2tJZkRyYWdnZWRJc0xhc3RFbG0oKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB0byA9IHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgaGFzVG9Nb3ZlU2libGluZ3NEb3duID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGUudGVtcEluZGV4ID0gdG87XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBMYXN0IHByZXZZIHVwZGF0ZSB3aGVuIGxlYXZpbmcgdGhlIHBhcmVudCBjb250YWluZXIuIFdoZW4gd2UgaGF2ZVxyXG4gICAgICAgICAgICAgKiBjb21pbmcgZWxlbWVudCBpbnNpZGUgd2UgbmVlZCBuZXcgdmFsdWUgc28gd2UgY2FuIGFzc2lnbiBpc01vdmVEb3duXHJcbiAgICAgICAgICAgICAqIGNvcnJlY3RseS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlLnByZXZZID0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51bmxvY2tQYXJlbnQoKTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNb3ZpbmcgZWxlbWVudCBkb3duIGJ5IHNldHRpbmcgaXMgdXAgdG8gZmFsc2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNldEVmZmVjdGVkRWxlbURpcmVjdGlvbihmYWxzZSk7XHJcbiAgICAgICAgaWYgKGhhc1RvTW92ZVNpYmxpbmdzRG93bikge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVEb3duKHRvKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5vdywgcmVzaXR0aW5nIGRpcmVjdGlvbiBieSBmaWd1cmluZyBvdXQgaWYgZHJhZ2dlZCBzZXR0bGVkIHVwL2R3bi5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHZhciBpc0VsbVVwID0gdGhpcy5sZWZ0QXRJbmRleCA+IHRoaXMuZHJhZ2dhYmxlLnRlbXBJbmRleDtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZmZlY3RlZEVsZW1EaXJlY3Rpb24oaXNFbG1VcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVmZmVjdGVkRWxlbURpcmVjdGlvbih0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUHJldmVudCBlbGVtZW50cyBjb2xsaXNpb24uIEFkZCBvbmx5IGlmIGVtcHR5LlxyXG4gICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZS5zaWJsaW5nc0xpc3RbdG9dLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdnYWJsZS5zaWJsaW5nc0xpc3RbdG9dID0gdGhpcy5kcmFnZ2FibGUuZHJhZ2dlZEVsbS5pZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbGxlZ2FsIEF0dGVtcHQ6IGRyYWdnZWQgaXMgcG9zaXRpb25lZCBhYm92ZSB0aGUgZXhpc3RpbmcgZWxlbWVudCBpbiB0aGUgaW5kZXggXCIgKyB0bywgdGhpcy5kcmFnZ2FibGUuc2libGluZ3NMaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVzZXQgaW5kZXguXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sZWZ0QXRJbmRleCA9IC0xO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogSW52b2tlcyBkcmFnZ2FibGUgbWV0aG9kIHJlc3BvbnNpYmxlIG9mIHRyYW5zZm9ybS5cclxuICAgICAqIE1vbml0b3JzIGRyYWdnZWQgdHJhbnNsYXRlIGFuZCBjYWxsZWQgcmVsYXRlZCBtZXRob2RzLiBXaGljaCBjb250cm9scyB0aGVcclxuICAgICAqIGFjdGl2ZSBhbmQgZHJvcHBhYmxlIG1ldGhvZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geC0gbW91c2UgWCBjb29yZGluYXRlXHJcbiAgICAgKiBAcGFyYW0geS0gbW91c2UgWSBjb29yZGluYXRlXHJcbiAgICAgKi9cclxuICAgIERyb3BwYWJsZS5wcm90b3R5cGUuZHJhZ0F0ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICB0aGlzLmRyYWdnYWJsZS5kcmFnQXQoeCwgeSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlLnNpYmxpbmdzTGlzdCA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpc091dFNpYmxpbmdzQ29udGFpbmVyID0gZmFsc2U7XHJcbiAgICAgICAgdmFyIHNLID0gRG5EU3RvcmVfMS5kZWZhdWx0LmdldEVsbUJ5SWQodGhpcy5kcmFnZ2FibGUuZHJhZ2dlZEVsbS5pZCkua2V5cy5zSztcclxuICAgICAgICB0aGlzLmRyYWdnYWJsZS5zZXREcmFnZ2VkTW92aW5nRG93bih5KTtcclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGUuaXNPdXRUaHJlc2hvbGQoKSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNMaXN0TG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnZWRPdXRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlzT3V0U2libGluZ3NDb250YWluZXIgPSB0aGlzLmRyYWdnYWJsZS5pc091dFRocmVzaG9sZChzSyk7XHJcbiAgICAgICAgICAgIC8vIC8vIHdoZW4gaXQncyBvdXQsIGFuZCBvbiBvZiB0aGVzZXMgaXMgdHJ1ZSB0aGVuIGl0J3MgaGFwcGVuaW5nLlxyXG4gICAgICAgICAgICBpZiAoIWlzT3V0U2libGluZ3NDb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dlZElzQ29taW5nSW4oeSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXaGVuIGRyYWdnZWQgaXMgb3V0IHBhcmVudCBhbmQgcmV0dXJuaW5nIHRvIGl0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLmlzTGlzdExvY2tlZCkge1xyXG4gICAgICAgICAgICBpc091dFNpYmxpbmdzQ29udGFpbmVyID0gdGhpcy5kcmFnZ2FibGUuaXNPdXRUaHJlc2hvbGQoc0spO1xyXG4gICAgICAgICAgICBpZiAoIWlzT3V0U2libGluZ3NDb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dlZElzQ29taW5nSW4oeSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERyb3BwYWJsZTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gRHJvcHBhYmxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ecm9wcGFibGUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBEbkRTdG9yZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9EbkRTdG9yZVwiKSk7XHJcbnZhciBEcm9wcGFibGVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9Ecm9wcGFibGVcIikpO1xyXG52YXIgRW5kRHJvcHBhYmxlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKEVuZERyb3BwYWJsZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIEVuZERyb3BwYWJsZShkcmFnZ2FibGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBkcmFnZ2FibGUpIHx8IHRoaXM7XHJcbiAgICAgICAgX3RoaXMuc3BsaWNlQXQgPSAtMTtcclxuICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbHN0IC1cclxuICAgICAqIEBwYXJhbSBpIC1cclxuICAgICAqL1xyXG4gICAgRW5kRHJvcHBhYmxlLnByb3RvdHlwZS51bmRvRWxtVHJhbnNsYXRlID0gZnVuY3Rpb24gKGxzdCwgaSkge1xyXG4gICAgICAgIHZhciBlbG1JRCA9IGxzdFtpXTtcclxuICAgICAgICBpZiAoZWxtSUQpIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtQnlJZChlbG1JRCk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBOb3RlOiByb2xsaW5nIGJhY2sgd29uJ3QgYWZmZWN0IG9yZGVyIGFycmF5LiBJdCBvbmx5IGRlYWxzIHdpdGggZWxlbWVudFxyXG4gICAgICAgICAgICAgKiBpdHNlbGYgYW5kIHRvdGFsbHkgaWdub3JlIGFueSBpbnN0YW5jZSByZWxhdGVkIHRvIHN0b3JlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZWxlbWVudC5yb2xsWUJhY2sodGhpcy5kcmFnZ2FibGUub3BlcmF0aW9uSUQpO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdnYWJsZS5udW1iZXJPZkVsZW1lbnRzVHJhbnNmb3JtZWQgLT0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3BsaWNlQXQgPSBpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBFbmREcm9wcGFibGUucHJvdG90eXBlLmxvb3BBc2NXaXRoQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoZnJvbSwgbHN0KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgaSA9IGZyb207XHJcbiAgICAgICAgdmFyIHJ1biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMudW5kb0VsbVRyYW5zbGF0ZShsc3QsIGkpO1xyXG4gICAgICAgICAgICBpICs9IDE7XHJcbiAgICAgICAgICAgIGlmIChpIDwgbHN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJ1bik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShydW4pO1xyXG4gICAgfTtcclxuICAgIEVuZERyb3BwYWJsZS5wcm90b3R5cGUubG9vcERlc1dpdGhBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChmcm9tLCBsc3QpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBpID0gZnJvbTtcclxuICAgICAgICB2YXIgcnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy51bmRvRWxtVHJhbnNsYXRlKGxzdCwgaSk7XHJcbiAgICAgICAgICAgIGkgLT0gMTtcclxuICAgICAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJ1bik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShydW4pO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogVW5kbyBsaXN0IGVsZW1lbnRzIG9yZGVyIGFuZCBpbnN0YW5jZXMgaW5jbHVkaW5nIHRyYW5zbGF0ZVgvWSBhbmQgaW5kZXhlc1xyXG4gICAgICogbG9jYWxseS5cclxuICAgICAqL1xyXG4gICAgRW5kRHJvcHBhYmxlLnByb3RvdHlwZS51bmRvTGlzdCA9IGZ1bmN0aW9uIChsc3QpIHtcclxuICAgICAgICB2YXIgX2EgPSB0aGlzLmRyYWdnYWJsZS5kcmFnZ2VkRWxtLCBmcm9tID0gX2Eub3JkZXIuc2VsZiwgZHJhZ2dlZElEID0gX2EuaWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMaXN0TG9ja2VkIHx8IHRoaXMuZHJhZ2dhYmxlLmlzTW92aW5nRG93bikge1xyXG4gICAgICAgICAgICB0aGlzLmxvb3BBc2NXaXRoQW5pbWF0aW9uRnJhbWUoZnJvbSwgbHN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJZiBmcm9tIGlzIHplcm8sIG1lYW5zIGRyYWdnZWQgbGVmdCwgYW5kIGFsbCBzaWJsaW5ncyBhcmUgbGlmdGVkIHVwLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGFjdHVhbEZyb20gPSBmcm9tID09PSAwID8gbHN0Lmxlbmd0aCAtIDEgOiBmcm9tO1xyXG4gICAgICAgICAgICB0aGlzLmxvb3BEZXNXaXRoQW5pbWF0aW9uRnJhbWUoYWN0dWFsRnJvbSwgbHN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbHN0LnNwbGljZSh0aGlzLnNwbGljZUF0LCAxKTtcclxuICAgICAgICBsc3Quc3BsaWNlKGZyb20sIDAsIGRyYWdnZWRJRCk7XHJcbiAgICB9O1xyXG4gICAgRW5kRHJvcHBhYmxlLnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiAobHN0KSB7XHJcbiAgICAgICAgdmFyIHNpYmxpbmdzQm91bmRhcmllcyA9IERuRFN0b3JlXzEuZGVmYXVsdC5zaWJsaW5nc0JvdW5kYXJpZXNbRG5EU3RvcmVfMS5kZWZhdWx0LnJlZ2lzdHJ5W3RoaXMuZHJhZ2dhYmxlLmRyYWdnZWRFbG0uaWRdLmtleXMuc0tdO1xyXG4gICAgICAgIHZhciBpZCA9IGxzdFswXTtcclxuICAgICAgICBpZiAoaWQubGVuZ3RoID09PSAwIHx8IHRoaXMuZHJhZ2dhYmxlLmRyYWdnZWRFbG0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoTWF0aC5mbG9vcihzaWJsaW5nc0JvdW5kYXJpZXMudG9wKSA9PT1cclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3IodGhpcy5kcmFnZ2FibGUub2NjdXBpZWRPZmZzZXQuY3VycmVudFRvcCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZWxlbWVudCA9IERuRFN0b3JlXzEuZGVmYXVsdC5nZXRFbG1CeUlkKGlkKTtcclxuICAgICAgICByZXR1cm4gKE1hdGguZmxvb3Ioc2libGluZ3NCb3VuZGFyaWVzLnRvcCkgPT09IE1hdGguZmxvb3IoZWxlbWVudC5jdXJyZW50VG9wKSk7XHJcbiAgICB9O1xyXG4gICAgRW5kRHJvcHBhYmxlLnByb3RvdHlwZS5lbmREcmFnZ2luZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2libGluZ3MgPSBEbkRTdG9yZV8xLmRlZmF1bHQuZ2V0RWxtU2libGluZ3NCeUlkKHRoaXMuZHJhZ2dhYmxlLmRyYWdnZWRFbG0uaWQpO1xyXG4gICAgICAgIHZhciBpc0ZhbGxiYWNrID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoc2libGluZ3MpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZS5pc05vdFNldHRsZWQoKSB8fCAhdGhpcy52ZXJpZnkoc2libGluZ3MpKSB7XHJcbiAgICAgICAgICAgICAgICBpc0ZhbGxiYWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudW5kb0xpc3Qoc2libGluZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlLmVuZERyYWdnaW5nKGlzRmFsbGJhY2spO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBFbmREcm9wcGFibGU7XHJcbn0oRHJvcHBhYmxlXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBFbmREcm9wcGFibGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUVuZERyb3BwYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcclxudmFyIEVuZERyb3BwYWJsZV8xID0gcmVxdWlyZShcIi4vRW5kRHJvcHBhYmxlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2ltcG9ydERlZmF1bHQoRW5kRHJvcHBhYmxlXzEpLmRlZmF1bHQ7IH0gfSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuRG5EID0gZXhwb3J0cy5zdG9yZSA9IHZvaWQgMDtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgRG5EU3RvcmVfMSA9IHJlcXVpcmUoXCIuL0RuRFN0b3JlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJzdG9yZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX19pbXBvcnREZWZhdWx0KERuRFN0b3JlXzEpLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBEbkRfMSA9IHJlcXVpcmUoXCIuL0RuRFwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRG5EXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2ltcG9ydERlZmF1bHQoRG5EXzEpLmRlZmF1bHQ7IH0gfSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB1dGlsc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3V0aWxzXCIpKTtcclxuLyoqXHJcbiAqIEdlbmVyYXRlIGtleXMgdG8gY29ubmVjdCByZWxhdGlvbnMgYmV0d2VlbiBET00tZWxlbWVudHMgZGVwZW5kaW5nIG9uIHRyZWVcclxuICogZGVwdGguXHJcbiAqL1xyXG52YXIgR2VuZXJhdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaW5kaWNhdG9yID0ge307XHJcbiAgICAgICAgdGhpcy5icmFuY2hlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMucHJldkRlcHRoID0gLTk5O1xyXG4gICAgICAgIHRoaXMucHJldktleSA9IHV0aWxzXzEuZGVmYXVsdCgwLCAwKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogSW5pdGlhdGVzIHNlbGYgYW5kIHBhcmVudCBpbmRpY2F0b3JzIGlmIG5vdC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZHAgLSBlbGVtZW50IGRlcHRoXHJcbiAgICAgKi9cclxuICAgIEdlbmVyYXRvci5wcm90b3R5cGUuaW5pdEluZGljYXRvcnMgPSBmdW5jdGlvbiAoZHApIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBpbml0aWF0ZSBzZWxmIGZyb20gLTEgc2luY2Ugc2VsZiBpcyBpbmNyZW1lbnRlZCBhZnRlciB0aGUgaWQgaXMgYWRkZWQgc29cclxuICAgICAgICAgKiBpdCdzIGNoaWxkcmVuIHdvbid0IGJlIGNvbmZ1c2VkIGFib3V0IHRoZWlyIHBhcmVudCBpbmRpY2F0b3IuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBpZiBzdGFydCBmcm9tIC9kcCA9IDEvXHJcbiAgICAgICAgICogLSB0aGlzLmluZGljYXRvclsxXSA9IC0xXHJcbiAgICAgICAgICogLSBlbGVtZW50IGFkZGVkXHJcbiAgICAgICAgICogLSAgdGhpcy5pbmRpY2F0b3JbMV0gKyAxXHJcbiAgICAgICAgICogTm93LCBJZiB3ZSBnZXQgL2RwID0gMC9cclxuICAgICAgICAgKiAtIHRoaXMuaW5kaWNhdG9yW2RwKzFdID0gMCB3aGljaCBpcyB3aGF0IHdlIHdhbnQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBCeSBhZGRpbmcgdGhpcywgd2UgY2FuIGRlYWwgd2l0aCBwYXJlbnRzIGNvbWluZyBmaXJzdCBiZWZvcmUgY2hpbGRyZW4uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yW2RwXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yW2RwXSA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBpbml0aWF0ZSBwYXJlbnRzIGZyb20gemVyby5cclxuICAgICAgICAgKiB0aGlzLmluZGljYXRvcltkcCsxXSA9IDBcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5pbmRpY2F0b3JbZHAgKyAxXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yW2RwICsgMV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbmRpY2F0b3JbZHAgKyAyXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yW2RwICsgMl0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqICBDaGVja3MgaWYgZWxlbWVudCBoYXMgbm8gc2libGluZ3MgaW4gdGhlIGJyYW5jaFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAgc2sgLSBTaWJsaW5ncyBLZXktIHNpYmxpbmdzIGtleVxyXG4gICAgICovXHJcbiAgICBHZW5lcmF0b3IucHJvdG90eXBlLmlzRWxtU2luZ2xldG9uID0gZnVuY3Rpb24gKHNLKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYnJhbmNoZXNbc0tdLmNvbnN0cnVjdG9yICE9PSBBcnJheTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgZWxlbWVudHMgdG8gaXRzIHNpYmxpbmdzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpZCAtIGVsZW1lbnQgaWRcclxuICAgICAqIEBwYXJhbSAgc2sgLSBTaWJsaW5ncyBLZXktIHNpYmxpbmdzIGtleVxyXG4gICAgICovXHJcbiAgICBHZW5lcmF0b3IucHJvdG90eXBlLmFkZFRvU2libGluZ3MgPSBmdW5jdGlvbiAoaWQsIHNLKSB7XHJcbiAgICAgICAgdmFyIHNlbGZJbmRleCA9IDA7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRG9uJ3QgY3JlYXRlIGFycmF5IGZvciBvbmx5IG9uZSBjaGlsZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5icmFuY2hlc1tzS10gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmJyYW5jaGVzW3NLXSA9IGlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNvIGhlcmUgd2UgaGF2ZSBtdWx0aXBsZSBjaGlsZHJlbiwgd2UgYmV0dGVyIGNyZWF0ZSBhbiBhcnJheSBub3cuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0VsbVNpbmdsZXRvbihzSykpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2SWQgPSB0aGlzLmJyYW5jaGVzW3NLXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnJhbmNoZXNbc0tdID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICB0aGlzLmJyYW5jaGVzW3NLXS5wdXNoKHByZXZJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBzZWxmSW5kZXggPSB0aGlzLmJyYW5jaGVzW3NLXS5wdXNoKGlkKSAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZWxmSW5kZXg7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIGFsbCBlbGVtZW50IElEcyBTaWJsaW5ncyBpbiBnaXZlbiBub2RlIHJlcHJlc2VudGVkIGJ5IHNrLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAgc2sgLSBTaWJsaW5ncyBLZXlcclxuICAgICAqL1xyXG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZS5nZXRFbG1CcmFuY2ggPSBmdW5jdGlvbiAoc2spIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5icmFuY2hlc1tza107XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIG5ldyBicmFuY2ggZm9yIGdpdmVuIGtleS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHNrIC0gU2libGluZ3MgS2V5LSBzaWJsaW5nIGtleVxyXG4gICAgICogQHBhcmFtIGJyYW5jaCAtIG5ldyBicmFuY2hcclxuICAgICAqL1xyXG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZS5zZXRFbG1CcmFuY2ggPSBmdW5jdGlvbiAoc0ssIGJyYW5jaCkge1xyXG4gICAgICAgIHRoaXMuYnJhbmNoZXNbc0tdID0gYnJhbmNoO1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogTWFpbiBtZXRob2QuXHJcbiAgICAgKlxyXG4gICAgICogQWRkIGVsZW1lbnQgdG8gYnJhbmNoZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkIC0gZWxlbWVudCBpZFxyXG4gICAgICogQHBhcmFtIGRlcHRoIC0gZWxlbWVudCBkZXB0aFxyXG4gICAgICovXHJcbiAgICBHZW5lcmF0b3IucHJvdG90eXBlLmdldEVsbVBvaW50ZXIgPSBmdW5jdGlvbiAoaWQsIGRlcHRoKSB7XHJcbiAgICAgICAgaWYgKGRlcHRoICE9PSB0aGlzLnByZXZEZXB0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRJbmRpY2F0b3JzKGRlcHRoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IHBhcmVudCBpbmRleC5cclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgcGFyZW50SW5kZXggPSB0aGlzLmluZGljYXRvcltkZXB0aCArIDFdO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdldCBzaWJsaW5ncyB1bmlxdWUga2V5IChzSykgYW5kIHBhcmVudHMga2V5IChwSylcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgc2libGluZ3NLZXkgPSB1dGlsc18xLmRlZmF1bHQoZGVwdGgsIHBhcmVudEluZGV4KTtcclxuICAgICAgICB2YXIgcGFyZW50S2V5ID0gdXRpbHNfMS5kZWZhdWx0KGRlcHRoICsgMSwgdGhpcy5pbmRpY2F0b3JbZGVwdGggKyAyXSk7XHJcbiAgICAgICAgdmFyIHNlbGZJbmRleCA9IHRoaXMuYWRkVG9TaWJsaW5ncyhpZCwgc2libGluZ3NLZXkpO1xyXG4gICAgICAgIGlmIChkZXB0aCA8IHRoaXMucHJldkRlcHRoKSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdGFydCBuZXcgYnJhbmNoLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3JbMF0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByZXZEZXB0aCA9IGRlcHRoO1xyXG4gICAgICAgIHZhciBjaGlsZHJlbktleSA9IHRoaXMucHJldktleTtcclxuICAgICAgICB0aGlzLnByZXZLZXkgPSBzaWJsaW5nc0tleTtcclxuICAgICAgICB0aGlzLmluZGljYXRvcltkZXB0aF0gKz0gMTtcclxuICAgICAgICB2YXIga2V5cyA9IHtcclxuICAgICAgICAgICAgc0s6IHNpYmxpbmdzS2V5LFxyXG4gICAgICAgICAgICBwSzogcGFyZW50S2V5LFxyXG4gICAgICAgICAgICBjaEs6IGRlcHRoID09PSAwID8gbnVsbCA6IGNoaWxkcmVuS2V5LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIG9yZGVyID0ge1xyXG4gICAgICAgICAgICBzZWxmOiBzZWxmSW5kZXgsXHJcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50SW5kZXgsXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4geyBvcmRlcjogb3JkZXIsIGtleXM6IGtleXMgfTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gR2VuZXJhdG9yO1xyXG59KCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSBHZW5lcmF0b3I7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUdlbmVyYXRvci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRlZmF1bHQgPSB2b2lkIDA7XHJcbnZhciBHZW5lcmF0b3JfMSA9IHJlcXVpcmUoXCIuL0dlbmVyYXRvclwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX19pbXBvcnREZWZhdWx0KEdlbmVyYXRvcl8xKS5kZWZhdWx0OyB9IH0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGdlbktleShkcCwgaSkge1xyXG4gICAgcmV0dXJuIGRwICsgXCItXCIgKyBpO1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGdlbktleTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGRyYWdnZWRTdHlsZVByb3BzID0gW1xyXG4gICAge1xyXG4gICAgICAgIHByb3A6IFwicG9zaXRpb25cIixcclxuICAgICAgICBkcmFnVmFsdWU6IFwicmVsYXRpdmVcIixcclxuICAgICAgICBhZnRlckRyYWdWYWx1ZTogbnVsbCxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgcHJvcDogXCJ6SW5kZXhcIixcclxuICAgICAgICBkcmFnVmFsdWU6IFwiOTlcIixcclxuICAgICAgICBhZnRlckRyYWdWYWx1ZTogbnVsbCxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgcHJvcDogXCJ1c2VyLXNlbGVjdFwiLFxyXG4gICAgICAgIGRyYWdWYWx1ZTogXCJub25lXCIsXHJcbiAgICAgICAgYWZ0ZXJEcmFnVmFsdWU6IG51bGwsXHJcbiAgICB9LFxyXG5dO1xyXG52YXIgQWJzdHJhY3REcmFnZ2FibGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQWJzdHJhY3REcmFnZ2FibGUuXHJcbiAgICAgKiBXb3JrcyBPbmx5IG9uIGRyYWdnZWQgZWxlbWVudCBsZXZlbC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYWJzdHJhY3RDb3JlRWxtIC1cclxuICAgICAqIEBwYXJhbSBpbml0Q29vcmRpbmF0ZXMgLVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBBYnN0cmFjdERyYWdnYWJsZShhYnN0cmFjdENvcmVFbG0sIF9hKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXNzaWduIGluc3RhbmNlIGZvciBkcmFnZ2VkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHZhciBpbml0WCA9IF9hLngsIGluaXRZID0gX2EueTtcclxuICAgICAgICB0aGlzLmRyYWdnZWRFbG0gPSBhYnN0cmFjdENvcmVFbG07XHJcbiAgICAgICAgdmFyIF9iID0gdGhpcy5kcmFnZ2VkRWxtLCB0cmFuc2xhdGVYID0gX2IudHJhbnNsYXRlWCwgdHJhbnNsYXRlWSA9IF9iLnRyYW5zbGF0ZVksIGRyYWdnZWRTdHlsZSA9IF9iLnJlZi5zdHlsZTtcclxuICAgICAgICB0aGlzLmRyYWdnZWRTdHlsZVJlZiA9IGRyYWdnZWRTdHlsZTtcclxuICAgICAgICB0aGlzLm91dGVyT2Zmc2V0WCA9IC1pbml0WCArIHRyYW5zbGF0ZVg7XHJcbiAgICAgICAgdGhpcy5vdXRlck9mZnNldFkgPSAtaW5pdFkgKyB0cmFuc2xhdGVZO1xyXG4gICAgICAgIHRoaXMudGVtcFRyYW5zbGF0ZSA9IHtcclxuICAgICAgICAgICAgeDogMCxcclxuICAgICAgICAgICAgeTogMCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZHJhZ2dlZFN0eWxlID0gZHJhZ2dlZFN0eWxlUHJvcHM7XHJcbiAgICAgICAgdGhpcy5zZXREcmFnZ2VkKHRydWUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmlnZ2VycyB0d2ljZS4gT25jZSB3aGVuIGNvbnN0cnVjdG9yIGlzIGluaXRpYXRlZCwgdGhlIG90aGVyIHdoZW4gZHJhZyBpc1xyXG4gICAgICogZW5kZWQuIEl0IGFkZHMvcmVtb3ZlcyBzdHlsZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaXNBY3RpdmUgLSBpcyBkcmFnZ2VkIG9wZXJhdGlvbiBhY3RpdmUgb3IgaXQgaXMgZW5kZWQuXHJcbiAgICAgKi9cclxuICAgIEFic3RyYWN0RHJhZ2dhYmxlLnByb3RvdHlwZS5zZXREcmFnZ2VkID0gZnVuY3Rpb24gKGlzQWN0aXZlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgaWYgKGlzQWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZFN0eWxlLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IF9hLnByb3AsIGRyYWdWYWx1ZSA9IF9hLmRyYWdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcclxuICAgICAgICAgICAgICAgIF90aGlzLmRyYWdnZWRTdHlsZVJlZltwcm9wXSA9IGRyYWdWYWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIChfYSA9IGdldFNlbGVjdGlvbigpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTm90IGFjdGl2ZTogZW5kIG9mIGRyYWdnaW5nLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZHJhZ2dlZFN0eWxlLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gX2EucHJvcCwgYWZ0ZXJEcmFnVmFsdWUgPSBfYS5hZnRlckRyYWdWYWx1ZTtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICBfdGhpcy5kcmFnZ2VkU3R5bGVSZWZbcHJvcF0gPSBhZnRlckRyYWdWYWx1ZTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvKipcclxuICAgICAqIEV4ZWN1dGVzIGRyYWdnaW5nIGJ5IGFwcGx5aW5nIHRyYW5zZm9ybS5cclxuICAgICAqIFdyaXRlcyB0byBkcmFnZ2VkRWxtQ3VycmVudE9mZnNldCBpbiBUcmFuc2Zvcm0gY2xhc3MuXHJcbiAgICAgKiBTZXQgdmFsdWVzIHRvIGlzRHJhZ2dlZCBmbGFncy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCAtIG1vdXNlIHggY29vcmRpbmF0ZXNcclxuICAgICAqIEBwYXJhbSB5IC0gbW91c2UgeSBjb29yZGluYXRlc1xyXG4gICAgICovXHJcbiAgICBBYnN0cmFjdERyYWdnYWJsZS5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYWxjdWxhdGVzIHRyYW5zbGF0ZSBjb29yZGluYXRlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEluZGljYXRlcyBkcmFnZ2VkIHktdHJhbnNmb3JtYXRpb24gdGhhdCdzIHdpbGwgYmUgdXBkYXRlZCBkdXJpbmcgdGhlXHJcbiAgICAgICAgICogZHJvcHBpbmcgcHJvY2Vzcy4gVXBkYXRpbmcgWSBpbW1lZGlhdGVseSB3aWxsIGVmZmVjdCBjYWxjdWxhdGlvbnMgaW5cclxuICAgICAgICAgKiB0cmFuc2Zvcm0sIHRoYXQncyB3aHkgaXQgaXMgdXBkYXRlZCB3aGVuIGRyYWdnaW5nIGlzIGRvbmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy50ZW1wVHJhbnNsYXRlLnggPSB4ICsgdGhpcy5vdXRlck9mZnNldFg7XHJcbiAgICAgICAgdGhpcy50ZW1wVHJhbnNsYXRlLnkgPSB5ICsgdGhpcy5vdXRlck9mZnNldFk7XHJcbiAgICAgICAgdGhpcy5kcmFnZ2VkU3R5bGVSZWYudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUzZChcIiArIHRoaXMudGVtcFRyYW5zbGF0ZS54ICsgXCJweCxcIiArIHRoaXMudGVtcFRyYW5zbGF0ZS55ICsgXCJweCwgMClcIjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQWJzdHJhY3REcmFnZ2FibGU7XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEFic3RyYWN0RHJhZ2dhYmxlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1BYnN0cmFjdERyYWdnYWJsZS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIERyYWdnYWJsZVN0b3JlSW1wXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vRHJhZ2dhYmxlU3RvcmVJbXBcIikpO1xyXG52YXIgQWJzdHJhY3REcmFnZ2FibGVfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9BYnN0cmFjdERyYWdnYWJsZVwiKSk7XHJcbnZhciBEcmFnZ2FibGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoRHJhZ2dhYmxlLCBfc3VwZXIpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIERyYWdnYWJsZS5cclxuICAgICAqIFdvcmtzIE9ubHkgb24gZHJhZ2dlZCBlbGVtZW50IGxldmVsLlxyXG4gICAgICpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaWQgLSBlbGVtZW50SWRcclxuICAgICAqIEBwYXJhbSBjbGlja0Nvb3JkaW5hdGVzIC1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRHJhZ2dhYmxlKGlkLCBjbGlja0Nvb3JkaW5hdGVzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgZWxlbWVudCA9IERyYWdnYWJsZVN0b3JlSW1wXzEuZGVmYXVsdC5nZXRFbG1CeUlkKGlkKTtcclxuICAgICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGVsZW1lbnQsIGNsaWNrQ29vcmRpbmF0ZXMpIHx8IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0geCAtXHJcbiAgICAgKiBAcGFyYW0geSAtXHJcbiAgICAgKi9cclxuICAgIERyYWdnYWJsZS5wcm90b3R5cGUuZHJhZ0F0ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnRyYW5zbGF0ZSh4LCB5KTtcclxuICAgICAgICB0aGlzLmRyYWdnZWRFbG0udHJhbnNsYXRlWCA9IHRoaXMudGVtcFRyYW5zbGF0ZS54O1xyXG4gICAgICAgIHRoaXMuZHJhZ2dlZEVsbS50cmFuc2xhdGVZID0gdGhpcy50ZW1wVHJhbnNsYXRlLnk7XHJcbiAgICB9O1xyXG4gICAgRHJhZ2dhYmxlLnByb3RvdHlwZS5lbmREcmFnZ2luZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNldERyYWdnZWQoZmFsc2UpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBEcmFnZ2FibGU7XHJcbn0oQWJzdHJhY3REcmFnZ2FibGVfMS5kZWZhdWx0KSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IERyYWdnYWJsZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RHJhZ2dhYmxlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vKipcclxuICogQ29weXJpZ2h0IChjKSBKYWxhbCBNYXNrb3VuLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBBR1BMMy4wIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcbnZhciBzdG9yZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJAZGZsZXgvc3RvcmVcIikpO1xyXG52YXIgY29yZV9pbnN0YW5jZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJAZGZsZXgvY29yZS1pbnN0YW5jZVwiKSk7XHJcbnZhciBEcmFnZ2FibGVTdG9yZUltcCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhEcmFnZ2FibGVTdG9yZUltcCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIERyYWdnYWJsZVN0b3JlSW1wKCkge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVnaXN0ZXIgZWxlbWVudCBmb3IgRHJhZ2dhYmxlIHN0b3JlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVsZW1lbnQgLVxyXG4gICAgICovXHJcbiAgICBEcmFnZ2FibGVTdG9yZUltcC5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xyXG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUucmVnaXN0ZXIuY2FsbCh0aGlzLCBlbGVtZW50LCBjb3JlX2luc3RhbmNlXzEuZGVmYXVsdCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIERyYWdnYWJsZVN0b3JlSW1wO1xyXG59KHN0b3JlXzEuZGVmYXVsdCkpO1xyXG5leHBvcnRzLmRlZmF1bHQgPSAoZnVuY3Rpb24gY3JlYXRlU3RvcmVJbnN0YW5jZSgpIHtcclxuICAgIHZhciBzdG9yZSA9IG5ldyBEcmFnZ2FibGVTdG9yZUltcCgpO1xyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG59KSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1EcmFnZ2FibGVTdG9yZUltcC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkFic3RyYWN0RHJhZ2dhYmxlID0gZXhwb3J0cy5zdG9yZSA9IGV4cG9ydHMuRHJhZ2dhYmxlID0gdm9pZCAwO1xyXG4vKipcclxuICogQ29weXJpZ2h0IChjKSBKYWxhbCBNYXNrb3VuLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBBR1BMMy4wIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cclxuICovXHJcbnZhciBEcmFnZ2FibGVfMSA9IHJlcXVpcmUoXCIuL0RyYWdnYWJsZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiRHJhZ2dhYmxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2ltcG9ydERlZmF1bHQoRHJhZ2dhYmxlXzEpLmRlZmF1bHQ7IH0gfSk7XHJcbnZhciBEcmFnZ2FibGVTdG9yZUltcF8xID0gcmVxdWlyZShcIi4vRHJhZ2dhYmxlU3RvcmVJbXBcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcInN0b3JlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2ltcG9ydERlZmF1bHQoRHJhZ2dhYmxlU3RvcmVJbXBfMSkuZGVmYXVsdDsgfSB9KTtcclxudmFyIEFic3RyYWN0RHJhZ2dhYmxlXzEgPSByZXF1aXJlKFwiLi9BYnN0cmFjdERyYWdnYWJsZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiQWJzdHJhY3REcmFnZ2FibGVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9faW1wb3J0RGVmYXVsdChBYnN0cmFjdERyYWdnYWJsZV8xKS5kZWZhdWx0OyB9IH0pO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn07XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIENvcHlyaWdodCAoYykgSmFsYWwgTWFza291bi5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQUdQTDMuMCBsaWNlbnNlIGZvdW5kIGluIHRoZVxyXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXHJcbiAqL1xyXG52YXIgZG9tX2dlbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJAZGZsZXgvZG9tLWdlblwiKSk7XHJcbnZhciBTdG9yZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFN0b3JlKCkge1xyXG4gICAgICAgIHRoaXMucmVnaXN0cnkgPSB7fTtcclxuICAgICAgICB0aGlzLkRPTUdlbiA9IG5ldyBkb21fZ2VuXzEuZGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGUgZWxlbWVudCBmcm9tIHRoZSByZWdpc3RyeS4gU2hvdWxkIGJlIGNhbGxlZCBvbmx5IHdoZW4gZWxlbWVudCBpc1xyXG4gICAgICogdW5tb3VudGVkIGFuZCBleHBlY3RlZCB0byByZXR1cm4gd2l0aCBkaWZmZXJlbnQgcG9zaXRpb25zIG9ubHkuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkIC1cclxuICAgICAqL1xyXG4gICAgU3RvcmUucHJvdG90eXBlLmRlbGV0ZUVsbSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHZhciBfYSA9IHRoaXMucmVnaXN0cnksIF9iID0gaWQsIG9sZFJlY29yZCA9IF9hW19iXSwgcmVzdCA9IF9fcmVzdChfYSwgW3R5cGVvZiBfYiA9PT0gXCJzeW1ib2xcIiA/IF9iIDogX2IgKyBcIlwiXSk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RyeSA9IHJlc3Q7XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBNdXRhdGUgZWxtSW5zdGFuY2UgaW50byBDdXN0b21JbnN0YW5jZSB0aGVuIGFkZCB0aGUgbmV3IG9iamVjdCB0byByZWdpc3RyeVxyXG4gICAgICogYnkgaWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVsZW1lbnQgLVxyXG4gICAgICogQHBhcmFtIEN1c3RvbUluc3RhbmNlIC1cclxuICAgICAqL1xyXG4gICAgU3RvcmUucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIEN1c3RvbUluc3RhbmNlLCBvcHRzKSB7XHJcbiAgICAgICAgdmFyIGlkRWxtID0gZWxlbWVudC5pZCwgX2EgPSBlbGVtZW50LmRlcHRoLCBkZXB0aCA9IF9hID09PSB2b2lkIDAgPyAwIDogX2EsIHJlZiA9IGVsZW1lbnQucmVmO1xyXG4gICAgICAgIGlmICghcmVmIHx8IHJlZi5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiREZsZXg6IEludmFsaWQgSFRNTEVsZW1lbnQ6IFwiICsgcmVmICsgXCIgaXMgcGFzc2VkIHRvIHJlZ2lzdHJ5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWlkRWxtICYmICFyZWYuaWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiREZsZXg6IEEgdmFsaWQgYW5kIHVuaXF1ZSBpZCBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpZCA9IGlkRWxtIHx8IHJlZi5pZDtcclxuICAgICAgICB2YXIgX2IgPSB0aGlzLkRPTUdlbi5nZXRFbG1Qb2ludGVyKGlkLCBkZXB0aCksIG9yZGVyID0gX2Iub3JkZXIsIGtleXMgPSBfYi5rZXlzO1xyXG4gICAgICAgIHZhciBjb3JlRWxlbWVudCA9IHsgaWQ6IGlkLCBkZXB0aDogZGVwdGgsIHJlZjogcmVmLCBvcmRlcjogb3JkZXIsIGtleXM6IGtleXMgfTtcclxuICAgICAgICAvLyBUT0RPOiBmaXggVFMgZXJyb3IgaGVyZS5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5yZWdpc3RyeVtpZF0gPVxyXG4gICAgICAgICAgICBDdXN0b21JbnN0YW5jZSAmJiB0eXBlb2YgQ3VzdG9tSW5zdGFuY2UuY29uc3RydWN0b3IgPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgPyBuZXcgQ3VzdG9tSW5zdGFuY2UoY29yZUVsZW1lbnQsIG9wdHMpXHJcbiAgICAgICAgICAgICAgICA6IGNvcmVFbGVtZW50O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0cyBlbGVtZW50IGZyb20gcmVnaXN0cnkgYnkgSWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkIC1cclxuICAgICAqL1xyXG4gICAgU3RvcmUucHJvdG90eXBlLmdldEVsbUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWdpc3RyeVtpZF07XHJcbiAgICB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIGFsbCBlbGVtZW50IElEcyBTaWJsaW5ncyBpbiBnaXZlbiBub2RlIHJlcHJlc2VudGVkIGJ5IHNpYmxpbmcga2V5LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzaWJsaW5nc0t5IC1cclxuICAgICAqL1xyXG4gICAgU3RvcmUucHJvdG90eXBlLmdldEVsbUJyYW5jaEJ5S2V5ID0gZnVuY3Rpb24gKHNpYmxpbmdzS3kpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ET01HZW4uZ2V0RWxtQnJhbmNoKHNpYmxpbmdzS3kpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTdG9yZTtcclxufSgpKTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gU3RvcmU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN0b3JlLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHZvaWQgMDtcclxudmFyIFN0b3JlXzEgPSByZXF1aXJlKFwiLi9TdG9yZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX19pbXBvcnREZWZhdWx0KFN0b3JlXzEpLmRlZmF1bHQ7IH0gfSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0XCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC9qc3gtZGV2LXJ1bnRpbWVcIik7OyJdLCJzb3VyY2VSb290IjoiIn0=