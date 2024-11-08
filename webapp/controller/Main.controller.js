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

        // Charge les données générales sans filtre
        loadTreeData: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");
            const iPageSize = this.oModel.getProperty("/pageSize");
            const apiUrl = this.oModel.getProperty("/apiUrl");
            const sUrl = `${apiUrl}?page=${iCurrentPage}&size=${iPageSize}`;

            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    this.oModel.setProperty("/trees", data.content || []);
                    this.oModel.setProperty("/totalPages", data.totalPages || 1);
                    this.oModel.setProperty("/totalElements", data.totalElements || 0);
                })
                .catch(error => {
                    MessageToast.show("Erreur lors du chargement des données");
                    console.error("Erreur:", error);
                });
        },

        // Filtre les données par arrondissement
        filterByArrondissement: function (sArrondissement) {
            const apiUrl = this.oModel.getProperty("/apiUrl") + "/arrondissement-count";
            const sUrl = `${apiUrl}?arrondissement=${encodeURIComponent(sArrondissement)}`;

            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    this.oModel.setProperty("/trees", data[0].trees || []);
                    this.oModel.setProperty("/totalPages", 1);  // Le filtre renvoie un seul ensemble
                    this.oModel.setProperty("/totalElements", data[0].treeCount || 0);
                })
                .catch(error => {
                    MessageToast.show("Erreur lors du chargement par arrondissement");
                    console.error("Erreur:", error);
                });
        },

        // Filtre les données par genre
        filterByGenre: function (sGenre) {
            const apiUrl = this.oModel.getProperty("/apiUrl") + "/genre-count";
            const sUrl = `${apiUrl}?genre=${encodeURIComponent(sGenre)}`;

            fetch(sUrl)
                .then(response => response.json())
                .then(data => {
                    this.oModel.setProperty("/trees", data[0].trees || []);
                    this.oModel.setProperty("/totalPages", 1);  // Le filtre renvoie un seul ensemble
                    this.oModel.setProperty("/totalElements", data[0].treeCount || 0);
                })
                .catch(error => {
                    MessageToast.show("Erreur lors du chargement par genre");
                    console.error("Erreur:", error);
                });
        },

        // Pagination - Page suivante
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

        // Pagination - Page précédente
        onPreviousPage: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");

            if (iCurrentPage > 0) {
                this.oModel.setProperty("/currentPage", iCurrentPage - 1);
                this.loadTreeData();
            } else {
                MessageToast.show("Vous êtes déjà sur la première page.");
            }
        },

        // Actions de filtre déclenchées par l'utilisateur
        onFilterArrondissement: function (oEvent) {
            const sArrondissement = oEvent.getSource().getValue();
            if (sArrondissement) {
                this.filterByArrondissement(sArrondissement);
            } else {
                this.loadTreeData();
            }
        },

        onFilterGenre: function (oEvent) {
            const sGenre = oEvent.getSource().getValue();
            if (sGenre) {
                this.filterByGenre(sGenre);
            } else {
                this.loadTreeData();
            }
        }
    });
});
