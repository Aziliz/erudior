import type { CourseWork, Rubric } from '../lib/courseWork';
import type { studioLearnerView } from '../lib/adminStudio';

type LearnerMaterial = ReturnType<typeof studioLearnerView>;
function RubricView({rubric}:{rubric:Rubric}) {
  return <section><h4>{rubric.title??'Assessment rubric'}</h4>{rubric.criteria.map(criterion=><section key={criterion.id}><h5>{criterion.name}</h5>{criterion.description&&<p>{criterion.description}</p>}<ul>{criterion.levels.map(level=><li key={level.points}><strong>{level.points} — {level.label}</strong>{level.description&&<>: {level.description}</>}</li>)}</ul></section>)}</section>;
}
function WorkView({work}:{work:CourseWork}) {
  return <>
    {work.writing?.map(task=><section key={task.id} aria-label={task.title}>
      <p>{task.kind==='essay'?'Essay':'Short response'}</p><p style={{whiteSpace:'pre-wrap'}}>{task.prompt}</p>
      {task.words&&<p>Word target: {task.words.min??'no minimum'}–{task.words.max??'no maximum'}</p>}
      {task.minutes!==undefined&&<p>Suggested time: {task.minutes} minutes</p>}
      {task.rubric&&task.selfCheck!==false&&<p>Check your work against the source rubric before handing it in.</p>}
    </section>)}
    {work.labs?.map(lab=><section key={lab.id} aria-label={lab.title}>
      <aside aria-label="Lab safety"><h4>Safety and supervision</h4>{lab.adult&&<p><strong>An adult must be present for the whole lab.</strong></p>}<ul>{lab.safety.map((text,i)=><li key={i}>{text}</li>)}</ul></aside>
      {lab.intro&&<p style={{whiteSpace:'pre-wrap'}}>{lab.intro}</p>}
      {lab.minutes!==undefined&&<p>Suggested time: {lab.minutes} minutes</p>}
      <h4>Materials</h4><ul>{lab.materials.map((text,i)=><li key={i}>{text}</li>)}</ul>
      <h4>Steps</h4><ol>{lab.steps.map((step,i)=><li key={i}>{step.adult&&<strong>Adult supervision required. </strong>}{step.text}</li>)}</ol>
      {lab.tables.map(table=><div key={table.id} style={{overflowX:'auto'}}><table><caption>{table.title??table.id}</caption><thead><tr>{table.columns.map((column,i)=><th scope="col" key={i}>{column}</th>)}</tr></thead><tbody>{Array.from({length:table.rows},(_,row)=><tr key={row}>{table.columns.map((_column,col)=>col===0?<th key={col} scope="row">{table.rowLabels?.[row]??`Row ${row+1}`}</th>:<td key={col}><span aria-label={`Blank response row ${row+1} column ${col+1}`}>________</span></td>)}</tr>)}</tbody></table></div>)}
      {lab.questions.map(question=><section key={question.id}><h4>{question.kind==='observation'?'Observation':'Conclusion'}</h4><p>{question.prompt}</p></section>)}
      {lab.photos&&<p>Photo prompt: {lab.photos}</p>}
      {lab.rubric&&lab.selfCheck!==false&&<p>Check your observations against the source rubric before handing them in.</p>}
    </section>)}
    {work.rubrics?.map(rubric=><RubricView key={rubric.id} rubric={rubric}/>)}
  </>;
}
/** Unmounted, inert rendering primitive. Caller must verify current server authority, source and
 * exact approved revision before delivery. Accepts ONLY the constructed learner projection.
 * No network/media execution, answers, account state, grading or response persistence. */
export default function StudioMaterialView({view,resourceIndex}:{view:LearnerMaterial;resourceIndex?:number}) {
  const resources=resourceIndex===undefined?view.resources:Number.isSafeInteger(resourceIndex)&&resourceIndex>=0&&resourceIndex<view.resources.length?[view.resources[resourceIndex]]:[];
  return <article aria-label={view.title} className="studio-material"><header><h2>{view.title}</h2><p>{view.kind.replaceAll('-',' ')}</p>{view.instructions&&<p style={{whiteSpace:'pre-wrap'}}>{view.instructions}</p>}</header>
    {!resources.length&&<p role="status">No material selected.</p>}
    {resources.map((resource,i)=><section key={i} className="panel"><h3>{resource.title}</h3><p className="small">Source: {resource.source.courseId} · revision {resource.source.revision}</p>
      {resource.work?<WorkView work={resource.work}/>:resource.blocks.map((block,index)=><section key={index}><h4>{block.label}</h4><p style={{whiteSpace:'pre-wrap'}}>{block.text}</p>{block.choices&&<ol type="A" aria-label="Response choices">{block.choices.map((choice,n)=><li key={n}>{choice}</li>)}</ol>}</section>)}
    </section>)}
    <p className="small">This material does not record responses or award course credit.</p>
  </article>;
}
