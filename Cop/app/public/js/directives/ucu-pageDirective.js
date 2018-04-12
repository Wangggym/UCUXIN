/**
 * Created by fanweihua on 2016/7/20.
 * pageDirective
 * 分页
 */
app.directive('pageDirective', function () {
    return {
        restrict: "E",
        scope: {
            options: "=", isOpen: "="
        },
        templateUrl: "public/tpl/directive/pageDirective.html",
        link: function (scope) {
            scope.options.pages = null;
            scope.options.pageindexList = function (Data) {
                /**
                 * 返回当前页数
                 * @param pagingData
                 * @returns {number}
                 */
                var returnsCurrentPage = function (pagingData) {
                    var pages = function (page) {
                        var isRemainder = page.PageIndex % 5;
                        var pageIndex = page.PageIndex;
                        if (isRemainder == 0) {
                            pageIndex--;
                        }
                        var startIndex = parseInt(pageIndex / 5) * 5 + 1;
                        return startIndex;
                    };
                    var page = pagingData;
                    if (page.ViewModelList) {
                        if (page.ViewModelList.length > 0) {
                            scope.visible = true;
                        } else {
                            scope.visible = false;
                        }
                    } else {
                        scope.visible = false;
                    }
                    var startIndex = pages(page);
                    var arr = [];
                    var index = 0;
                    for (var i = startIndex; i <= page.Pages; i++) {
                        index++;
                        var pageRow = {
                            class: "btn btn-default",
                            pIndex: i
                        };
                        if (page.PageIndex == i) {
                            pageRow.class = "btn btn-default active";
                        }
                        if (index == 6) {
                            pageRow.pIndex = "...";
                            pageRow.index = i;
                            arr.push(pageRow);
                            break;
                        }
                        arr.push(pageRow);
                        if (startIndex > 1 && index == 1) {
                            var pageRow = {
                                class: "btn btn-default",
                                pIndex: "..."
                            };
                            pageRow.index = i - 1;
                            arr.unshift(pageRow);
                        }
                    }
                    scope.pageList = arr;
                };
                if (!Data) {
                    scope.pageList = undefined;
                    return;
                }
                returnsCurrentPage(Data);//返回当前分页
                /**
                 * 点击分页
                 * @param page
                 */
                scope.flip = function (page) {
                    if (page.class.indexOf('active') != -1) {
                        return;
                    }
                    if (page.index) {
                        if (page.pIndex.indexOf("..") != -1) {
                            page.pIndex = page.index;
                        }
                    }
                    scope.options.fliPage(page);
                };
                /**
                 * 下一页
                 * @param page
                 */
                scope.next = function (page) {
                    var pageNext = 0;
                    for (var i = 0; i < page.length; i++) {
                        if (page[i].class.indexOf("active") != -1) {
                            pageNext = page[i].pIndex + 1;
                            break;
                        }
                    }
                    var isPage = pageNext > scope.options.pages ? false : true;
                    if (isPage) {
                        scope.options.nextPage(pageNext);
                    }
                };
                /**
                 * 上一页
                 * @param page
                 */
                scope.previous = function (page) {
                    var pageNext = 0;
                    for (var i = 0; i < page.length; i++) {
                        if (page[i].class.indexOf("active") != -1) {
                            pageNext = page[i].pIndex - 1;
                            break;
                        }
                    }
                    var isPage = pageNext == 0 ? false : true;
                    if (isPage) {
                        scope.options.previousPage(pageNext);
                    }
                };
            };
        }
    };
});