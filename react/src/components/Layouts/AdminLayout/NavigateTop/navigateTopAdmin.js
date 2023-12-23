import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Assets/adminLayout.css"
import { faBars, faCogs, faDonate, faEnvelope, faExclamationTriangle, faList, faSearch, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell, faFileAlt } from "@fortawesome/free-regular-svg-icons";
// import "../Assets/vendor/jquery/jquery.min.js"
// import "../Assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
// import "../Assets/vendor/jquery-easing/jquery.easing.min.js"
// import "../Assets/js/sb-admin-2.min.js"

function NavigateAdmin(){
    return (
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"> 
            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                <FontAwesomeIcon icon={faBars} class="fa fa-bars"></FontAwesomeIcon>
            </button>

            <h2>Trang chủ</h2>

            <ul class="navbar-nav ml-auto">

                <li class="nav-item dropdown no-arrow d-sm-none">
                    <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon icon={faSearch} class="fas fa-search fa-fw" ></FontAwesomeIcon>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                        aria-labelledby="searchDropdown">
                        <form class="form-inline mr-auto w-100 navbar-search">
                            <div class="input-group">
                                <input type="text" class="form-control bg-light border-0 small"
                                    placeholder="Search for..." aria-label="Search"
                                    aria-describedby="basic-addon2"/>
                                <div class="input-group-append">
                                    <button class="btn btn-primary" type="button">
                                        <FontAwesomeIcon icon={faSearch} class="fas fa-search fa-sm"></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>

                <li class="nav-item dropdown no-arrow mx-1">
                    <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon icon={faBell} class="fas fa-bell fa-fw"></FontAwesomeIcon>
                        <span class="badge badge-danger badge-counter">3+</span>
                    </a>
                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="alertsDropdown">
                        <h6 class="dropdown-header">
                            Alerts Center
                        </h6>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="mr-3">
                                <div class="icon-circle bg-primary">
                                    <FontAwesomeIcon icon={faFileAlt} class="fas fa-file-alt text-white"></FontAwesomeIcon>
                                </div>
                            </div>
                            <div>
                                <div class="small text-gray-500">December 12, 2019</div>
                                <span class="font-weight-bold">A new monthly report is ready to download!</span>
                            </div>
                        </a>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="mr-3">
                                <div class="icon-circle bg-success">
                                    <FontAwesomeIcon icon={faDonate} class="fas fa-donate text-white"></FontAwesomeIcon>
                                </div>
                            </div>
                            <div>
                                <div class="small text-gray-500">December 7, 2019</div>
                                $290.29 has been deposited into your account!
                            </div>
                        </a>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="mr-3">
                                <div class="icon-circle bg-warning">
                                    <FontAwesomeIcon icon={faExclamationTriangle} class="fas fa-exclamation-triangle text-white"></FontAwesomeIcon>
                                </div>
                            </div>
                            <div>
                                <div class="small text-gray-500">December 2, 2019</div>
                                Spending Alert: We've noticed unusually high spending for your account.
                            </div>
                        </a>
                        <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                    </div>
                </li>

                <li class="nav-item dropdown no-arrow mx-1">
                    <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <FontAwesomeIcon icon={faEnvelope} class="fas fa-envelope fa-fw"></FontAwesomeIcon>
                        <span class="badge badge-danger badge-counter">7</span>
                    </a>
                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="messagesDropdown">
                        <h6 class="dropdown-header">
                            Message Center
                        </h6>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image mr-3">
                                <img class="rounded-circle" src="img/undraw_profile_1.svg"
                                    alt="..."/>
                                <div class="status-indicator bg-success"></div>
                            </div>
                            <div class="font-weight-bold">
                                <div class="text-truncate">Hi there! I am wondering if you can help me with a
                                    problem I've been having.</div>
                                <div class="small text-gray-500">Emily Fowler · 58m</div>
                            </div>
                        </a>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image mr-3">
                                <img class="rounded-circle" src="img/undraw_profile_2.svg"
                                    alt="..."/>
                                <div class="status-indicator"></div>
                            </div>
                            <div>
                                <div class="text-truncate">I have the photos that you ordered last month, how
                                    would you like them sent to you?</div>
                                <div class="small text-gray-500">Jae Chun · 1d</div>
                            </div>
                        </a>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image mr-3">
                                <img class="rounded-circle" src="img/undraw_profile_3.svg"
                                    alt="..."/>
                                <div class="status-indicator bg-warning"></div>
                            </div>
                            <div>
                                <div class="text-truncate">Last month's report looks great, I am very happy with
                                    the progress so far, keep up the good work!</div>
                                <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                            </div>
                        </a>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div class="dropdown-list-image mr-3">
                                <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                    alt="..."/>
                                <div class="status-indicator bg-success"></div>
                            </div>
                            <div>
                                <div class="text-truncate">Am I a good boy? The reason I ask is because someone
                                    told me that people say this to all dogs, even if they aren't good...</div>
                                <div class="small text-gray-500">Chicken the Dog · 2w</div>
                            </div>
                        </a>
                        <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                    </div>
                </li>

                <div class="topbar-divider d-none d-sm-block"></div>

                <li class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">Lê Anh Tuấn Dũng</span>
                        <img class="img-profile rounded-circle"
                            src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/329119549_1831369480561844_4837817454509676737_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGbNR1w-U5yXdA5nV0-klWcMrik9lQrzWEyuKT2VCvNYdR7NDEpQ6r3c706PZylDafzHi3gxC7kdEGs3GawUpfu&_nc_ohc=-4dYJ9Pb284AX-tao5a&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfBoeOxmNa5xVcXxf0wrvOI3Pvh6sZpZvH7tb6RzTEQmSg&oe=65403070"/>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                        aria-labelledby="userDropdown">
                        <a class="dropdown-item" href="#">
                            <FontAwesomeIcon icon={faUser} class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></FontAwesomeIcon>
                            Profile
                        </a>
                        <a class="dropdown-item" href="#">
                            <FontAwesomeIcon icon={faCogs} class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></FontAwesomeIcon>
                            Settings
                        </a>
                        <a class="dropdown-item" href="#">
                            <FontAwesomeIcon icon={faList} class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></FontAwesomeIcon>
                            Activity Log
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                            <FontAwesomeIcon icon={faSignOut} class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></FontAwesomeIcon>
                            Logout
                        </a>
                    </div>
                </li>

            </ul>

        </nav>
    )
}

export default NavigateAdmin;