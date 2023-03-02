package web.varlamov.hicam.websocket;

import lombok.Data;

@Data
public class CommandSocketTextMessage {
  private String id;
  private CommandSocketTextMessageMission mission;
  private CommandSocketTextMessagePurpose purpose;
  private String from;
  private String to;
  private Object data;

  public static enum CommandSocketTextMessageMission {
    PASS_RTC_PEER_CONNECTION_COMMAND,
    PASS_RTC_SESSION_DESCRIPTION__SUCCESS,
  }

  public static enum CommandSocketTextMessagePurpose {
    ACCEPT_OFFER,
    ACCEPT_OFFER__SUCCESS,

    ADD_ICE_CANDIDATE,
    ADD_ICE_CANDIDATE__SUCCESS,

    SET_REMOTE_DESCRIPTION,
    SET_REMOTE_DESCRIPTION__SUCCESS,

    CREATE_ANSWER,
    CREATE_ANSWER__SUCCESS,

    SET_LOCAL_DESCRIPTION,
    SET_LOCAL_DESCRIPTION__SUCCESS
  }
}
