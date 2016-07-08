<div class="digin-lgn-wrap animated" ng-controller="signup-ctrl">
    <toast></toast>

    <div layout="column" layout-align="center center">

        <div class="digin-login-card animated flipInY">
            <div layout="row" layout-xs="column">
                <div flex="45">
                    <div class="left-main-wrap ">
                        <div class="left-wrap signup">
                            <ul class="bg-bubbles">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                            <div class="login-logo sign-up border-white-5">
                                <img src="image/signup-user.png"
                                     align="center">
                            </div>
                            <span class="login-welcome">
                               Sign up now
                            </span>
                            <h5>
                                DigIn
                            </h5>

                            <div class="welcome-link sign-in-link"
                                 ng-click="onClickSignIn()">
                                <a href="javascript:void(0)">Sign in</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div flex="55">
                    <div class="right-wrap sign-up-wrap">
                        <div class="header-login">
                            <div class="login-text-wrap pull-right ">
                                <h5 id="sliderRight">Sign Up</h5>
                            </div>
                        </div>
                        <form name="frmDiginSignUp" autocomplete="off">
                            <div class="login-bdy">
                                <div class="text-wrap ">
                                    <div>
                                        <div class="form-inline">
                                            <div class="text-domain-name full-name"
                                                 ng-class="{error:error.isFirstName,'':!error.isFirstName}">
                                                <label for="firstName">first name</label>
                                                <div>
                                                    <input type="text" class="form-control"
                                                           id="firstName"
                                                           name="firstName"
                                                           ng-model="signUpUsr.firstName"
                                                           required
                                                           placeholder="first name">
                                                </div>
                                                <div ng-show="frmDiginSignUp.firstName.$invalid && !frmDiginSignUp.firstName.$pristine"
                                                 class="ng-message" ng-messages="frmDiginSignUp.firstName.$error">
                                                    <div ng-message="required">This is required.</div>
                                                </div>
                                            </div>
                                            <div class=" text-domain-name full-name"
                                                 ng-class="{error:error.isLastName,'':!error.isLastName}">
                                                <label for="lastName">last name</label>
                                                <div>
                                                    <input type="text" class="form-control"
                                                           id="lastName"
                                                           name="lastName"
                                                           required
                                                           ng-model="signUpUsr.lastName"
                                                           placeholder="last name">
                                                </div>
                                                <div ng-show="frmDiginSignUp.lastName.$invalid && !frmDiginSignUp.lastName.$pristine"
                                                class="ng-message" ng-messages="frmDiginSignUp.lastName.$error">
                                                    <div ng-message="required">This is required.</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="txt-box-login p-t-20"
                                             ng-class="{error:error.isEmail,'':!error.isEmail}">
                                            <label for="email">email</label>
                                            <div>
                                                <input type="email" class="form-control"
                                                       id="email"
                                                       name="email"
                                                       required
                                                       ng-pattern="regex.email"
                                                       ng-model="signUpUsr.email"
                                                       placeholder="jane.doe@example.com">
                                            </div>
                                            <div ng-show="frmDiginSignUp.email.$invalid && !frmDiginSignUp.email.$pristine"
                                            class="ng-message" ng-messages="frmDiginSignUp.email.$error">
                                                <div ng-message="required">This is required.</div>
                                                <div ng-message="pattern">Your email address is invalid</div>
                                            </div>
                                        </div>

                                        <div class="form-inline">
                                            <div class="text-domain-name full-name p-t-20"
                                                 ng-class="{error:error.isPassword,'':!error.isPassword}">
                                                <label for="password">password</label>
                                                <div>
                                                    <input type="password" class="form-control"
                                                           id="password"
                                                           name="password"
                                                           required
                                                           ng-model="signUpUsr.pwd"

                                                           placeholder="password">
                                                </div>
                                                <div ng-show="frmDiginSignUp.password.$invalid && !frmDiginSignUp.password.$pristine"
                                                class="ng-message"
                                                     ng-messages="frmDiginSignUp.password.$error">
                                                    <div ng-message="required">This is required.</div>
                                                </div>
                                            </div>
                                            <div class="text-domain-name full-name"
                                                 ng-class="{error:error.isRetypeCnfrm,'':!error.isRetypeCnfrm}">
                                                <label for="cnfrmPwd">confirm password</label>
                                                <div>
                                                    <input type="password" class="form-control"
                                                           id="cnfrmPwd"
                                                           name="cnfrmPwd"
                                                           required
                                                           ng-model="signUpUsr.cnfrPwd"
                                                           password-verify="signUpUsr.pwd"
                                                           placeholder="confirm password">
                                                </div>
                                                <div ng-show="frmDiginSignUp.cnfrmPwd.$invalid && !frmDiginSignUp.cnfrmPwd.$pristine"
                                                class="ng-message"
                                                     ng-show=" frmDiginSignUp.cnfrmPwd.$invalid
                                                     && !frmDiginSignUp.cnfrmPwd.$pristine"
                                                > Password not match
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="login-loading" ng-if="error.isLoading">
                                    <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <div class="login-btn-wrap sign-btn-wrap" ng-if="!error.isLoading">
                                    <a href="javascript:void(0)"
                                       ng-click="submit()"
                                       ng-class="{disable:frmDiginSignUp.$invalid,active: !frmDiginSignUp.$invalid}"
                                       class="login-btn">
                                        sign up
                                    </a>
                                </div>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-wrap">
        copyright 2016 digin.io - All Rights Reserved
    </div>

</div>