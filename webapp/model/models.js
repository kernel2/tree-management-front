sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/demo/treemanagement/model/models" // Adjust path as needed
], function (Controller, JSONModel, MessageToast, models) {
    "use strict";

    return Controller.extend("sap.ui.demo.treemanagement.controller.Main", {
        onInit: function () {
            const oTreeModel = models.createTreeModel();
            this.getView().setModel(oTreeModel);

            this.loadTreeData();
        },

        loadTreeData: function () {
            const oModel = this.getView().getModel();
            const iCurrentPage = oModel.getProperty("/currentPage");
            const iPageSize = oModel.getProperty("/pageSize");
            const sUrl = `/api/trees?page=${iCurrentPage}&size=${iPageSize}`;

            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    oModel.setProperty("/trees", data.content); // Set the list of trees
                    oModel.setProperty("/totalPages", data.totalPages); // Total pages
                    oModel.setProperty("/totalElements", data.totalElements); // Total elements
                })
                .catch(error => {
                    MessageToast.show("Erreur lors du chargement des données");
                    console.error("Erreur:", error);
                });
        },

        onNextPage: function () {
            const oModel = this.getView().getModel();
            const iCurrentPage = oModel.getProperty("/currentPage");
            const iTotalPages = oModel.getProperty("/totalPages");

            if (iCurrentPage < iTotalPages - 1) {
                oModel.setProperty("/currentPage", iCurrentPage + 1);
                this.loadTreeData();
            }
        },

        onPreviousPage: function () {
            const oModel = this.getView().getModel();
            const iCurrentPage = oModel.getProperty("/currentPage");

            if (iCurrentPage > 0) {
                oModel.setProperty("/currentPage", iCurrentPage - 1);
                this.loadTreeData();
            }
        }
    });
});
