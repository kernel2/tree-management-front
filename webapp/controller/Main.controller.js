sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("sap.ui.demo.treemanagement.controller.Main", {
        onInit: function () {
            // Define the model once and store it in an instance variable
            this.oModel = this.getOwnerComponent().getModel("treesModel");
            this.loadTreeData();
        },

        loadTreeData: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");
            const iPageSize = this.oModel.getProperty("/pageSize");
            const apiUrl = this.oModel.getProperty("/apiUrl");
            const sUrl = `${apiUrl}?page=${iCurrentPage}&size=${iPageSize}`;

            console.log(`Fetching data from: ${sUrl}`);

            fetch(sUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.content) {
                        // Update the model properties with the fetched data
                        this.oModel.setProperty("/trees", data.content);
                        this.oModel.setProperty("/totalPages", data.totalPages);
                        this.oModel.setProperty("/totalElements", data.totalElements);

                        // Display the current page and total pages for pagination verification
                        console.log(`Page ${iCurrentPage + 1} sur ${data.totalPages}`);
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

            console.log("Current Page:", iCurrentPage);
            console.log("Total Pages:", iTotalPages);

            // Move to the next page if available
            if (iCurrentPage < iTotalPages - 1) {
                this.oModel.setProperty("/currentPage", iCurrentPage + 1);
                this.loadTreeData();
            } else {
                MessageToast.show("Vous êtes déjà sur la dernière page.");
            }
        },

        onPreviousPage: function () {
            const iCurrentPage = this.oModel.getProperty("/currentPage");

            console.log("Current Page:", iCurrentPage);

            // Move to the previous page if available
            if (iCurrentPage > 0) {
                this.oModel.setProperty("/currentPage", iCurrentPage - 1);
                this.loadTreeData();
            } else {
                MessageToast.show("Vous êtes déjà sur la première page.");
            }
        }
    });
});
