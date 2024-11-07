sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("sap.ui.demo.treemanagement.controller.Main", {
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel("treesModel");
            this.loadTreeData();
        },

        loadTreeData: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");
            const iPageSize = this.oModel.getProperty("/pageSize");
            const apiUrl = this.oModel.getProperty("/apiUrl");
            const sUrl = `${apiUrl}?page=${iCurrentPage}&size=${iPageSize}`;

            fetch(sUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.content) {
                        this.oModel.setProperty("/trees", data.content);
                        this.oModel.setProperty("/totalPages", data.totalPages);
                        this.oModel.setProperty("/totalElements", data.totalElements);
                    } else {
                        MessageToast.show("Erreur: Les données reçues sont incorrectes.");
                    }
                })
                .catch(error => {
                    MessageToast.show("Erreur lors du chargement des données");
                    console.error("Erreur:", error);
                });
        },

        onNextPage: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");
            const iTotalPages = this.oModel.getProperty("/totalPages");

            if (iCurrentPage < iTotalPages - 1) {
                this.oModel.setProperty("/currentPage", iCurrentPage + 1);
                this.loadTreeData();
            } else {
                MessageToast.show("Vous êtes déjà sur la dernière page.");
            }
        },

        onPreviousPage: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");

            if (iCurrentPage > 0) {
                this.oModel.setProperty("/currentPage", iCurrentPage - 1);
                this.loadTreeData();
            } else {
                MessageToast.show("Vous êtes déjà sur la première page.");
            }
        }
    });
});
