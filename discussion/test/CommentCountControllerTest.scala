package test

import org.scalatest.{BeforeAndAfterAll, DoNotDiscover, FlatSpec, Matchers}
import play.api.test.Helpers._
import controllers.CommentCountController

@DoNotDiscover class CommentCountControllerTest extends FlatSpec with Matchers with ConfiguredTestSuite with BeforeAndAfterAll with WithTestWsClient {

  "Discussion" should "return 200" in {
    val result = new CommentCountController(new DiscussionApiStub(wsClient)).commentCount("p/37v3a")(TestRequest())
    status(result) should be(200)
  }
}
