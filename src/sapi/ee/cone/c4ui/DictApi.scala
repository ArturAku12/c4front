package ee.cone.c4ui

import ee.cone.c4di._
import ee.cone.c4vdom.Types._
import ee.cone.c4vdom._

class DictApi {
  @c4el("Dict") def dict(
    key: String,
    url: String,
    children: ChildPairList[OfDiv] = Nil,
  ): ToChildPair
}
