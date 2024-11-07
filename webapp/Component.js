sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.ui.demo.treemanagement.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            const oModel = new JSONModel({
                trees: [],
                currentPage: 0,
                totalPages: 1,
                pageSize: 100,
                totalElements: 0,
                apiUrl: "http://localhost:8080/api/trees"
            });
            this.setModel(oModel, "treesModel");
        }
    });
});
