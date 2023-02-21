import { element } from 'protractor';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRecordVinyl, faExpand, faUserGroup } from '@fortawesome/free-solid-svg-icons';

declare var JitsiMeetExternalAPI: any;

@Component({
    selector: 'app-jitsi',
    templateUrl: './jitsi.component.html',
    styleUrls: ['./jitsi.component.css']
})
export class JitsiComponent implements OnInit, AfterViewInit {

    domain: string = "jitsi.exzaconcert.com";
    room: any;
    options: any;
    api: any;
    user: any;
    enabled: Boolean;

    faRecordVinyl=faRecordVinyl;
    faExpand=faExpand;
    faUserGroup=faUserGroup;

    // For Custom Controls
    isAudioMuted = false;
    isVideoMuted = false;

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        this.room = 'bwb-bfqi-vmh'; // set your room name
        this.user = {
            name: 'Avirup Dutta' // set your username
        }
    }

    ngAfterViewInit(): void {
        this.options = {
            roomName: this.room,
            width: 900,
            height: 500,
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
                // overwrite interface properties
                TILE_VIEW_MAX_COLUMN: 8,
                DISABLE_DOMINANT_SPEAKER_INDICATOR: true,
                DEFAULT_LOGO_URL: 'images/eXzaTech-Transparent_White.png',
                filmStripOnly: false,
                DISPLAY_WELCOME_PAGE_CONTENT: false,
                SHOW_JITSI_WATERMARK: false,
                TOOLBAR_ALWAYS_VISIBLE: true,
                SHOW_WATERMARK_FOR_GUESTS: false,
                DEFAULT_REMOTE_DISPLAY_NAME: 'New User',
                TOOLBAR_BUTTONS: [
                    'closedcaptions', 'desktop',
                    'fodeviceselection', 'hangup', 'profile', '', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings',
                    'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'mute-everyone',
                    'e2ee'
                  ],
                
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: this.user.name
            }
        }

        this.api = new JitsiMeetExternalAPI(this.domain, this.options);

        this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus
        });

        this.api.addEventListener('videoConferenceStart', () => {
            this.api.executeCommand('startRecording', {
                mode: 'file',
                //dropboxToken: 'MyToken',
                rtmpStreamKey: 'test'
            });
        });
    }


    handleClose = () => {
        console.log("handleClose");
    }

    handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await this.getParticipants();
    }

    handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await this.getParticipants();
    }

    handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await this.getParticipants();
    }

    handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        this.router.navigate(['/thank-you']);
    }

    handleMuteStatus = (audio) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    handleVideoStatus = (video) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    // custom events
    executeCommand(command: string) {
        this.api.executeCommand(command);
        var elem = document.documentElement;
       
        if(command == 'hangup') {
            this.router.navigate(['/thank-you']);
            return;
        }

        if(command == 'toggleAudio') {
            this.isAudioMuted = !this.isAudioMuted;
        }

        if(command == 'toggleVideo') {
            this.isVideoMuted = !this.isVideoMuted;
        }

        if(command == 'startRecording'){
            // this.api.executeCommand('startRecording',{
            //     mode: 'file',
            //     shouldShare: true,
            //     rtmpStreamKey: 'test'
            // });

            
                this.api.executeCommand('startRecording', {
                    mode: 'stream',
                    //shouldShare: true,
                    youtubeStreamKey: '75m7-mpkk-0g0p-mhxy-11rd',
                    //dropboxToken: 'MyToken',
                    //rtmpStreamKey: 'test'
                });
            
        }

        if(command=='resizeLargeVideo'){ 
     
            this.api.resizeLargeVideo(100, 100);
        }

        if(command=='toggleParticipantsPane'){
            this.api.executeCommand('toggleParticipantsPane',
            this.enabled= true // The visibility status of the participants pane.
        );
        }
  }
}
