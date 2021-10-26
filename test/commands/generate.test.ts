import {expect, test} from '@oclif/test'
import * as path from 'path'
import {compareSync} from 'dir-compare'

describe('generate', () => {
  test
    .stdout()
    .command(['generate'])
    .it('should create clientlib', ctx => {
      const res = compareSync(
        path.resolve(process.cwd(), 'clientlib-demo'),
        path.resolve(process.cwd(), 'clientlib-demo-expected'),
      )
      expect(res.same).to.be.true
    })
})
